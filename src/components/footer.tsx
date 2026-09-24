"use client";

import { useEffect, useState } from "react";
import { profile } from "@/data/profile";
import { openPalette } from "@/lib/events";
import { apiUrl, NAV, scrollToId } from "@/lib/site";
import { ArrowUp, Github, Linkedin, Mail } from "./icons";
import { StatusDot } from "./ui";

const REGION_NAMES: Record<string, string> = {
  bom1: "Mumbai",
  sin1: "Singapore",
  iad1: "Washington, D.C.",
  fra1: "Frankfurt",
  local: "localhost",
};

type Health = { status: string; region: string } | null;

function ApiStatus() {
  const [health, setHealth] = useState<Health | "down" | null>(null);
  useEffect(() => {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000);
    fetch(apiUrl("/api/health"), { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: Health) => setHealth(data))
      .catch(() => setHealth("down"))
      .finally(() => clearTimeout(timer));
    return () => ctrl.abort();
  }, []);

  if (health === null) {
    return (
      <span className="flex items-center gap-2">
        <StatusDot tone="muted" /> Checking API…
      </span>
    );
  }
  if (health === "down") {
    return (
      <span className="flex items-center gap-2">
        <StatusDot tone="warn" /> API unreachable · static mode
      </span>
    );
  }
  const region = health.region;
  return (
    <span className="flex items-center gap-2">
      <StatusDot /> API online · {REGION_NAMES[region] ?? region} ({region})
    </span>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden border-t border-line">
      <div className="mx-auto max-w-6xl px-5 pt-16 pb-10 sm:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <p className="text-2xl font-semibold tracking-tight">{profile.name}</p>
            <p className="mt-2 text-muted">{profile.headline}</p>
            <div className="mt-6 flex gap-2">
              {[
                { href: profile.socials.github, label: "GitHub", Icon: Github },
                ...(profile.socials.linkedin ? [{ href: profile.socials.linkedin, label: "LinkedIn", Icon: Linkedin }] : []),
                { href: `mailto:${profile.email}`, label: "Email", Icon: Mail },
              ].map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  aria-label={label}
                  className="grid size-10 place-items-center rounded-xl border border-line text-muted transition-colors hover:border-line-strong hover:text-fg"
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 text-sm sm:gap-16">
            <div>
              <p className="font-mono text-xs tracking-widest text-subtle uppercase">Navigate</p>
              <ul className="mt-4 space-y-2.5">
                {NAV.map((n) => (
                  <li key={n.id}>
                    <a
                      href={`/#${n.id}`}
                      onClick={(e) => {
                        if (!document.getElementById(n.id)) return;
                        e.preventDefault();
                        scrollToId(n.id);
                      }}
                      className="text-muted transition-colors hover:text-fg"
                    >
                      {n.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-mono text-xs tracking-widest text-subtle uppercase">More</p>
              <ul className="mt-4 space-y-2.5">
                <li>
                  <a href="/resume" className="text-muted transition-colors hover:text-fg">
                    Résumé
                  </a>
                </li>
                <li>
                  <a href={apiUrl("/api/profile")} target="_blank" rel="noreferrer" className="text-muted transition-colors hover:text-fg">
                    Profile API
                  </a>
                </li>
                <li>
                  <button type="button" onClick={openPalette} className="text-muted transition-colors hover:text-fg">
                    Command menu
                  </button>
                </li>
                <li>
                  <a
                    href="https://github.com/captainakarsh/captainakarsh.github.io"
                    target="_blank"
                    rel="noreferrer"
                    className="text-muted transition-colors hover:text-fg"
                  >
                    Source code
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col-reverse gap-4 border-t border-line pt-6 font-mono text-xs text-subtle md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {profile.name} · Built with Next.js, deployed on Vercel
          </p>
          <div className="flex items-center gap-5">
            <ApiStatus />
            <button
              type="button"
              onClick={() => scrollToId("top")}
              className="flex items-center gap-1.5 transition-colors hover:text-fg"
              aria-label="Back to top"
            >
              Top <ArrowUp size={13} />
            </button>
          </div>
        </div>
      </div>

      <p
        aria-hidden
        className="pointer-events-none -mb-[0.22em] text-center text-[clamp(5rem,22vw,20rem)] leading-none font-semibold tracking-[-0.06em] text-transparent select-none [-webkit-text-stroke:1px_var(--line-strong)]"
      >
        {profile.firstName.toUpperCase()}
      </p>
    </footer>
  );
}
