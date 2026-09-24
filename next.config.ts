import type { NextConfig } from "next";

// STATIC_EXPORT=true builds the static copy for GitHub Pages (see .github/workflows/pages.yml).
// Everything else — local dev and Vercel — runs the full app with its API routes.
const isStaticExport = process.env.STATIC_EXPORT === "true";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  ...(isStaticExport
    ? // GitHub Pages serves folders, so emit /resume/index.html rather than /resume.html.
      { output: "export", trailingSlash: true, images: { unoptimized: true } }
    : {
        async headers() {
          return [{ source: "/(.*)", headers: securityHeaders }];
        },
      }),
};

export default nextConfig;
