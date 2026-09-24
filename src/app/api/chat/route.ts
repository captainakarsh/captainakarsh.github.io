import Anthropic from "@anthropic-ai/sdk";
import { profile } from "@/data/profile";
import { SYSTEM_PROMPT } from "@/lib/server/assistant";
import { clientIp, corsHeaders, isOriginAllowed, json, preflight, rateLimit } from "@/lib/server/http";

export const maxDuration = 60;

const MODEL = process.env.CHAT_MODEL || "claude-opus-5";
// Server-side refusal fallbacks are available on the Opus 5 / Fable 5 families.
const SUPPORTS_FALLBACKS = /^claude-(opus-5|fable-5)/.test(MODEL);

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
  // The API requires the conversation to start with the user and to end on a user turn.
  while (turns.length && turns[0].role !== "user") turns.shift();
  if (!turns.length || turns[turns.length - 1].role !== "user") return "The last message must come from the user.";
  return turns;
}

export function OPTIONS(req: Request) {
  return preflight(req);
}

export async function POST(req: Request) {
  if (!isOriginAllowed(req)) return json(req, { error: "Origin not allowed." }, { status: 403 });

  if (!process.env.ANTHROPIC_API_KEY) {
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

  const client = new Anthropic();
  const stream = client.beta.messages.stream(
    {
      model: MODEL,
      // Visitor-facing chat on the owner's key: short answers, capped spend.
      max_tokens: 4096,
      output_config: { effort: "low" },
      cache_control: { type: "ephemeral" },
      system: SYSTEM_PROMPT,
      messages,
      ...(SUPPORTS_FALLBACKS ? { betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" as const } : {}),
    },
    { signal: req.signal },
  );

  const encoder = new TextEncoder();
  const body$ = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        const final = await stream.finalMessage();
        if (final.stop_reason === "refusal") {
          controller.enqueue(
            encoder.encode(`\n\nI can't help with that one — feel free to ask about ${profile.firstName}'s work instead.`),
          );
        } else if (final.stop_reason === "max_tokens") {
          controller.enqueue(encoder.encode("…"));
        }
        controller.close();
      } catch (error) {
        if (req.signal.aborted) {
          controller.close();
          return;
        }
        let message = "Something went wrong while answering. Please try again.";
        if (error instanceof Anthropic.RateLimitError) {
          message = "The assistant is busy right now. Please try again in a minute.";
        } else if (error instanceof Anthropic.AuthenticationError) {
          message = "The assistant is misconfigured. Please use the contact form instead.";
        } else if (error instanceof Anthropic.APIError) {
          console.error("chat: Anthropic API error", error.status, error.message);
        } else {
          console.error("chat: unexpected error", error);
        }
        controller.enqueue(encoder.encode(`\n\n⚠️ ${message}`));
        controller.close();
      }
    },
    cancel() {
      stream.abort();
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
