import { profile } from "@/data/profile";
import { SYSTEM_PROMPT } from "@/lib/server/assistant";
import { clientIp, corsHeaders, isOriginAllowed, json, preflight, rateLimit } from "@/lib/server/http";

export const maxDuration = 60;

// DeepSeek's API is OpenAI-compatible. deepseek-chat is the low-cost general model.
const API_URL = (process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com").replace(/\/$/, "") + "/chat/completions";
const MODEL = process.env.CHAT_MODEL || "deepseek-chat";

const MAX_MESSAGES = 16;
const MAX_MESSAGE_CHARS = 1500;
const MAX_TOTAL_CHARS = 12_000;

type ChatTurn = { role: "user" | "assistant"; content: string };

function parseMessages(body: unknown): ChatTurn[] | string {
  if (!body || typeof body !== "object" || !Array.isArray((body as { messages?: unknown }).messages)) {
    return "Expected { messages: [...] }.";
  }
  const raw = (body as { messages: unknown[] }).messages.slice(-MAX_MESSAGES);
  const turns: ChatTurn[] = [];
  let total = 0;
  for (const m of raw) {
    if (!m || typeof m !== "object") return "Invalid message.";
    const { role, content } = m as { role?: unknown; content?: unknown };
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") return "Invalid message.";
    const text = content.trim();
    if (!text) continue;
    if (text.length > MAX_MESSAGE_CHARS) return `Messages are limited to ${MAX_MESSAGE_CHARS} characters.`;
    total += text.length;
    turns.push({ role, content: text });
  }
  if (total > MAX_TOTAL_CHARS) return "This conversation is getting long — please start a new one.";
  // Conversations must start with the user and end on a user turn.
  while (turns.length && turns[0].role !== "user") turns.shift();
  if (!turns.length || turns[turns.length - 1].role !== "user") return "The last message must come from the user.";
  return turns;
}

function upstreamErrorMessage(status: number): string {
  if (status === 429) return "The assistant is busy right now. Please try again in a minute.";
  if (status === 401 || status === 403) return "The assistant is misconfigured. Please use the contact form instead.";
  if (status === 402) return "The assistant is temporarily unavailable. Please use the contact form instead.";
  return "Something went wrong while answering. Please try again.";
}

export function OPTIONS(req: Request) {
  return preflight(req);
}

export async function POST(req: Request) {
  if (!isOriginAllowed(req)) return json(req, { error: "Origin not allowed." }, { status: 403 });

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return json(req, { error: "The AI assistant isn't configured yet.", code: "not_configured" }, { status: 503 });
  }

  const ip = clientIp(req);
  const burst = rateLimit(`chat:burst:${ip}`, 6, 60_000);
  const hourly = rateLimit(`chat:hour:${ip}`, 40, 60 * 60_000);
  if (!burst.ok || !hourly.ok) {
    const retryAfter = Math.max(burst.retryAfter, hourly.retryAfter);
    return json(
      req,
      { error: "You're sending messages quickly — give it a moment and try again.", code: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json(req, { error: "Invalid JSON body." }, { status: 400 });
  }
  const messages = parseMessages(body);
  if (typeof messages === "string") return json(req, { error: messages }, { status: 400 });

  let upstream: Response;
  try {
    upstream = await fetch(API_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
        stream: true,
        // Visitor-facing chat on the owner's key: short answers, capped spend.
        max_tokens: 800,
        temperature: 0.5,
      }),
      signal: req.signal,
    });
  } catch (error) {
    console.error("chat: could not reach DeepSeek", error);
    return json(req, { error: upstreamErrorMessage(502) }, { status: 502 });
  }

  if (!upstream.ok || !upstream.body) {
    console.error("chat: DeepSeek responded", upstream.status, await upstream.text().catch(() => ""));
    return json(req, { error: upstreamErrorMessage(upstream.status) }, { status: 502 });
  }

  // Convert DeepSeek's server-sent events into a plain text stream for the widget.
  const reader = upstream.body.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  const body$ = new ReadableStream<Uint8Array>({
    async start(controller) {
      let buffer = "";
      let finish: string | null = null;
      try {
        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            const data = line.trim();
            if (!data.startsWith("data:")) continue;
            const payload = data.slice(5).trim();
            if (payload === "[DONE]") continue;
            try {
              const chunk = JSON.parse(payload) as {
                choices?: { delta?: { content?: string | null }; finish_reason?: string | null }[];
              };
              const choice = chunk.choices?.[0];
              if (choice?.delta?.content) controller.enqueue(encoder.encode(choice.delta.content));
              if (choice?.finish_reason) finish = choice.finish_reason;
            } catch {
              // Ignore keep-alive comments and partial lines.
            }
          }
        }
        if (finish === "length") controller.enqueue(encoder.encode("…"));
        if (finish === "content_filter") {
          controller.enqueue(
            encoder.encode(`\n\nI can't help with that one — feel free to ask about ${profile.firstName}'s work instead.`),
          );
        }
        controller.close();
      } catch (error) {
        if (req.signal.aborted) {
          controller.close();
          return;
        }
        console.error("chat: stream failed", error);
        controller.enqueue(encoder.encode(`\n\n⚠️ ${upstreamErrorMessage(500)}`));
        controller.close();
      }
    },
    cancel() {
      reader.cancel().catch(() => {});
    },
  });

  return new Response(body$, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      ...corsHeaders(req),
    },
  });
}
