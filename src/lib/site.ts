export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://captainakarsh.github.io").replace(/\/$/, "");

// Empty on Vercel (same origin). The GitHub Pages build points this at the Vercel deployment.
export const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");

export const apiUrl = (path: string) => `${API_BASE}${path}`;

export const NAV = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
] as const;

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  history.replaceState(null, "", id === "top" ? location.pathname : `#${id}`);
}
