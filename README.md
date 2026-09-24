# Akarsh Singh — Portfolio

Personal portfolio of **Akarsh Singh**, Full Stack Engineer. Built with Next.js 16 (App Router), React 19, Tailwind CSS v4 and Motion; the backend lives in the same app as API routes.

- **Vercel (full app + API):** deployed to the **Mumbai (`bom1`)** region
- **GitHub Pages:** <https://captainakarsh.github.io>, a static export that talks to the Vercel API

## Features

- Animated hero with a live-typed code card, rotating focus line and count-up stats
- Bento "About" grid with a live IST clock, experience timeline with scroll-linked progress
- Filterable projects with animated product mockups for AxaPDF and NonriX
- **AI assistant** that streams answers about Akarsh's experience from the Claude API (`/api/chat`)
- **Contact form** with validation, honeypot and rate limiting, delivered by email (Resend) and/or a Discord/Slack webhook (`/api/contact`)
- ⌘K / Ctrl K command palette, dark/light theme, toasts, scroll progress, reduced-motion support
- Printable résumé page at `/resume` (Save as PDF)
- SEO: metadata, Open Graph image, JSON-LD, sitemap, robots, web manifest
- Live API status in the footer, which shows the serving region

All content lives in [`src/data/profile.ts`](src/data/profile.ts). Edit it there and the site, the résumé page, `/api/profile` and the AI assistant's knowledge all update.

## Architecture

```
                 ┌────────────────────────────┐
 browser ──────▶ │ Vercel · Next.js (bom1)    │  pages + /api/chat, /api/contact,
                 │                            │  /api/health, /api/profile
                 └──────────────▲─────────────┘
                                │ CORS (fetch)
 browser ──────▶ captainakarsh.github.io (static export of the same pages)
```

| Route | Method | Purpose |
| --- | --- | --- |
| `/api/chat` | POST | Streams a Claude answer grounded in `profile.ts` (plain-text stream) |
| `/api/contact` | POST | Validates and delivers contact-form messages |
| `/api/health` | GET | Status, serving region and which features are configured |
| `/api/profile` | GET | The portfolio data as JSON (public, CORS-open) |

## Local development

```bash
npm install
cp .env.example .env.local   # fill in the keys you want to use
npm run dev                  # http://localhost:3000
```

Other scripts: `npm run lint`, `npm run typecheck`, `npm run build` (Vercel build) and `npm run build:pages` (static export into `out/`).

## Deploying

### 1. Vercel (Mumbai)

1. Import this repository at <https://vercel.com/new>. The framework is detected automatically.
2. Add the environment variables from [`.env.example`](.env.example): at least `ANTHROPIC_API_KEY` for the AI assistant, plus `RESEND_API_KEY` or `CONTACT_WEBHOOK_URL` for the contact form.
3. Deploy. [`vercel.json`](vercel.json) pins the functions to `bom1` (Mumbai).

### 2. GitHub Pages

1. In **Settings → Pages**, set **Source** to **Deploy from a branch**, then choose **`gh-pages`** and **`/ (root)`**.
2. If your Vercel URL isn't `https://captainakarsh-github-io.vercel.app`, add a repository variable `API_BASE_URL` with the real URL under **Settings → Secrets and variables → Actions → Variables**.
3. Push to `main`. [`.github/workflows/pages.yml`](.github/workflows/pages.yml) builds the static export and force-pushes it to the `gh-pages` branch. To publish by hand, run `npm run build:pages` and push the contents of `out/` to `gh-pages`.

`https://captainakarsh.github.io` is already allowed by the API's CORS policy. To call the API from other origins, add them to `ALLOWED_ORIGINS`.
