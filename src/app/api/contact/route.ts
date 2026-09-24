import { profile } from "@/data/profile";
import { clientIp, isOriginAllowed, json, preflight, rateLimit } from "@/lib/server/http";

const TOPICS = ["Full-time role", "Freelance project", "Collaboration", "Just saying hi"] as const;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type ContactMessage = { name: string; email: string; topic: string; message: string };

function validate(body: unknown): { data: ContactMessage; honeypot: boolean } | { error: string; field?: string } {
  if (!body || typeof body !== "object") return { error: "Invalid request." };
  const b = body as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const name = str(b.name);
  const email = str(b.email);
  const topic = str(b.topic);
  const message = str(b.message);

  if (name.length < 2 || name.length > 80) return { error: "Please enter your name.", field: "name" };
  if (!EMAIL_RE.test(email) || email.length > 200) return { error: "Please enter a valid email.", field: "email" };
  if (message.length < 10) return { error: "Your message is a little short.", field: "message" };
  if (message.length > 4000) return { error: "Please keep your message under 4000 characters.", field: "message" };

  return {
    data: { name, email, topic: (TOPICS as readonly string[]).includes(topic) ? topic : "General", message },
    honeypot: str(b.website).length > 0,
  };
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

async function sendEmail(m: ContactMessage): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>",
      to: [process.env.CONTACT_TO_EMAIL || profile.email],
      reply_to: m.email,
      subject: `Portfolio · ${m.topic} — ${m.name}`,
      text: `${m.message}\n\n— ${m.name} <${m.email}>`,
      html: `<div style="font-family:system-ui,sans-serif;line-height:1.6">
        <p style="color:#666;margin:0 0 12px">New message from your portfolio · <strong>${escapeHtml(m.topic)}</strong></p>
        <p style="white-space:pre-wrap;margin:0 0 16px">${escapeHtml(m.message)}</p>
        <p style="margin:0">— ${escapeHtml(m.name)} &lt;<a href="mailto:${escapeHtml(m.email)}">${escapeHtml(m.email)}</a>&gt;</p>
      </div>`,
    }),
  });
  if (!res.ok) console.error("contact: Resend responded", res.status, await res.text().catch(() => ""));
  return res.ok;
}

async function sendWebhook(m: ContactMessage): Promise<boolean> {
  const url = process.env.CONTACT_WEBHOOK_URL;
  if (!url) return false;
  const text = `📬 **${m.topic}** from ${m.name} (${m.email})\n\n${m.message}`.slice(0, 1900);
  // `content` is read by Discord, `text` by Slack.
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: text, text }),
  });
  if (!res.ok) console.error("contact: webhook responded", res.status);
  return res.ok;
}

export function OPTIONS(req: Request) {
  return preflight(req);
}

export async function POST(req: Request) {
  if (!isOriginAllowed(req)) return json(req, { error: "Origin not allowed." }, { status: 403 });

  const limit = rateLimit(`contact:${clientIp(req)}`, 5, 15 * 60_000);
  if (!limit.ok) {
    return json(
      req,
      { error: "You've sent a few messages already — please try again a bit later." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json(req, { error: "Invalid JSON body." }, { status: 400 });
  }

  const result = validate(body);
  if ("error" in result) return json(req, result, { status: 400 });
  // Bots fill the hidden field; pretend it worked so they move on.
  if (result.honeypot) return json(req, { ok: true });

  if (!process.env.RESEND_API_KEY && !process.env.CONTACT_WEBHOOK_URL) {
    return json(
      req,
      { error: "The contact form isn't connected yet — please email me directly.", code: "not_configured" },
      { status: 503 },
    );
  }

  const outcomes = await Promise.allSettled([sendEmail(result.data), sendWebhook(result.data)]);
  const delivered = outcomes.some((o) => o.status === "fulfilled" && o.value);
  if (!delivered) {
    for (const o of outcomes) if (o.status === "rejected") console.error("contact: delivery failed", o.reason);
    return json(req, { error: "Couldn't deliver your message right now — please email me directly." }, { status: 502 });
  }
  return json(req, { ok: true });
}
