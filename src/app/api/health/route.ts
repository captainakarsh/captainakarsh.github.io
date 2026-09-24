import { json, preflight } from "@/lib/server/http";

export function OPTIONS(req: Request) {
  return preflight(req, { open: true });
}

export function GET(req: Request) {
  return json(
    req,
    {
      status: "ok",
      region: process.env.VERCEL_REGION ?? "local",
      features: {
        chat: Boolean(process.env.DEEPSEEK_API_KEY),
        contact: Boolean(process.env.RESEND_API_KEY || process.env.CONTACT_WEBHOOK_URL),
      },
      time: new Date().toISOString(),
    },
    { open: true },
  );
}
