"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useState, useSyncExternalStore } from "react";
import { profile } from "@/data/profile";
import { openPalette } from "@/lib/events";
import { NAV, scrollToId } from "@/lib/site";
import { Menu, Search, X } from "./icons";
import { ThemeToggle } from "./theme-toggle";

function useActiveSection() {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const sections = NAV.map((n) => document.getElementById(n.id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);
  return active;
}

const noopSubscribe = () => () => {};

export function Nav() {
  const active = useActiveSection();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const isMac = useSyncExternalStore(
    noopSubscribe,
    () => /Mac|iPhone|iPad/.test(navigator.platform),
    () => true,
  );

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    scrollToId(id);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
      <nav
        aria-label="Primary"
        className={`relative flex w-full max-w-5xl items-center justify-between gap-2 rounded-2xl border py-2 pr-2 pl-3 transition-all duration-500 ${
          scrolled || open ? "glass border-line shadow-card" : "border-transparent"
        }`}
      >
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            go("top");
          }}
          className="group flex items-center gap-2.5 rounded-lg"
          aria-label={`${profile.name} — back to top`}
        >
          <span className="relative grid size-8 place-items-center overflow-hidden rounded-[10px] bg-fg font-mono text-[13px] font-semibold text-bg">
            <span className="absolute inset-0 bg-[linear-gradient(135deg,var(--accent),var(--accent-2))] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <span className="relative">{profile.initials}</span>
          </span>
          <span className="hidden text-sm font-medium tracking-tight sm:block">{profile.name}</span>
        </a>

        <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">
          {NAV.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  go(item.id);
                }}
                className={`relative isolate rounded-full px-3.5 py-1.5 text-sm transition-colors ${
                  active === item.id ? "text-fg" : "text-muted hover:text-fg"
                }`}
              >
                {active === item.id && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 -z-10 rounded-full border border-line bg-surface-2"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={openPalette}
            className="hidden h-9 items-center gap-2 rounded-xl border border-line bg-surface px-2.5 text-xs text-muted transition-colors hover:border-line-strong hover:text-fg sm:flex"
            aria-label="Open command menu"
          >
            <Search size={14} />
            <kbd className="font-mono text-[11px]">{isMac ? "⌘" : "Ctrl"} K</kbd>
          </button>
          <ThemeToggle />
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              go("contact");
            }}
            className="hidden h-9 items-center rounded-xl bg-fg px-3.5 text-sm font-medium text-bg transition-transform hover:scale-[1.03] active:scale-[0.98] sm:flex"
          >
            Let&apos;s talk
          </a>
          <button
            type="button"
            className="grid size-9 place-items-center rounded-xl border border-line bg-surface text-muted md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-x-0 top-[calc(100%+8px)] rounded-2xl border border-line bg-bg-soft p-2 shadow-card md:hidden"
            >
              <ul className="grid">
                {NAV.map((item, i) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        go(item.id);
                      }}
                      className="flex items-center justify-between rounded-xl px-4 py-3 text-base text-muted transition-colors hover:bg-surface-2 hover:text-fg"
                    >
                      {item.label}
                      <span className="font-mono text-xs text-subtle">0{i + 1}</span>
                    </a>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  openPalette();
                }}
                className="mt-1 flex w-full items-center gap-2 rounded-xl px-4 py-3 text-sm text-subtle hover:bg-surface-2"
              >
                <Search size={14} /> Search & quick actions
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
