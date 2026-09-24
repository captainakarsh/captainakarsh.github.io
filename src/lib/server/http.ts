// Shared helpers for the API routes: CORS, origin checks, JSON responses,
// client IP extraction and a small in-memory rate limiter.

const DEFAULT_ORIGINS = ["https://captainakarsh.github.io", "http://localhost:3000"];

function allowedOrigins(): string[] {
  const extra = (process.env.ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((o) => o.trim().replace(/\/$/, ""))
    .filter(Boolean);
  return [...DEFAULT_ORIGINS, ...extra];
}

function requestHost(req: Request): string | null {
  return req.headers.get("x-forwarded-host") ?? req.headers.get("host");
}

/**
 * Browsers always send Origin on cross-origin requests and on same-origin POSTs.
 * Requests without one (curl, server-to-server) are allowed and rely on rate limiting.
 */
export function isOriginAllowed(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  if (allowedOrigins().includes(origin)) return true;
  try {
    return new URL(origin).host === requestHost(req);
  } catch {
    return false;
  }
}

export function corsHeaders(req: Request, { open = false } = {}): Record<string, string> {
  const origin = req.headers.get("origin");
  const headers: Record<string, string> = { Vary: "Origin" };
  if (open) {
    headers["Access-Control-Allow-Origin"] = "*";
  } else if (origin && isOriginAllowed(req)) {
    headers["Access-Control-Allow-Origin"] = origin;
  } else {
    return headers;
  }
  headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS";
  headers["Access-Control-Allow-Headers"] = "Content-Type";
  headers["Access-Control-Max-Age"] = "86400";
  return headers;
}

export function preflight(req: Request, opts?: { open?: boolean }) {
  return new Response(null, { status: 204, headers: corsHeaders(req, opts) });
}

export function json(
  req: Request,
  data: unknown,
  init: { status?: number; headers?: Record<string, string>; open?: boolean } = {},
) {
  return Response.json(data, {
    status: init.status ?? 200,
    headers: { "Cache-Control": "no-store", ...corsHeaders(req, { open: init.open }), ...init.headers },
  });
}

export function clientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

/**
 * Fixed-window limiter. State lives in the function instance, so it's a
 * best-effort guard against bursts rather than a global quota.
 */
export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  if (buckets.size > 10_000) {
    for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
  }
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }
  if (bucket.count >= limit) {
    return { ok: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
  }
  bucket.count += 1;
  return { ok: true, retryAfter: 0 };
}
