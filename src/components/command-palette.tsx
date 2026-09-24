"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { profile, projects } from "@/data/profile";
import { copyText, EVENTS, openChat, toggleTheme } from "@/lib/events";
import { NAV, scrollToId } from "@/lib/site";
import {
  ArrowRight,
  ArrowUpRight,
  Copy,
  CornerDownLeft,
  FileText,
  Github,
  Linkedin,
  Mail,
  Moon,
  Search,
  Sparkles,
} from "./icons";

type Command = {
  id: string;
  group: string;
  label: string;
  hint?: string;
  keywords?: string;
  icon: React.ComponentType<{ size?: number }>;
  run: () => void;
};

function buildCommands(router: ReturnType<typeof useRouter>): Command[] {
  const nav: Command[] = NAV.map((n) => ({
    id: `nav-${n.id}`,
    group: "Navigate",
    label: n.label,
    icon: ArrowRight,
    run: () => scrollToId(n.id),
  }));
  const work: Command[] = projects
    .filter((p) => p.url)
    .map((p) => ({
      id: `proj-${p.slug}`,
      group: "Projects",
      label: `Open ${p.name}`,
      hint: p.urlLabel,
      keywords: p.stack.join(" "),
      icon: ArrowUpRight,
      run: () => window.open(p.url, "_blank", "noopener"),
    }));
  const actions: Command[] = [
    { id: "ai", group: "Actions", label: "Ask the AI assistant", keywords: "chat claude question", icon: Sparkles, run: () => openChat() },
    { id: "copy-email", group: "Actions", label: "Copy email address", hint: profile.email, icon: Copy, run: () => copyText(profile.email, "Email copied") },
    { id: "email", group: "Actions", label: "Send an email", icon: Mail, run: () => (location.href = `mailto:${profile.email}`) },
    { id: "resume", group: "Actions", label: "View résumé", keywords: "cv resume pdf print", icon: FileText, run: () => router.push("/resume") },
    { id: "theme", group: "Actions", label: "Toggle light / dark theme", keywords: "dark light mode", icon: Moon, run: toggleTheme },
  ];
  const social: Command[] = [
    { id: "github", group: "Social", label: "GitHub", hint: "@captainakarsh", icon: Github, run: () => window.open(profile.socials.github, "_blank", "noopener") },
    ...(profile.socials.linkedin
      ? [{ id: "linkedin", group: "Social", label: "LinkedIn", icon: Linkedin, run: () => window.open(profile.socials.linkedin, "_blank", "noopener") }]
      : []),
  ];
  return [...nav, ...actions, ...work, ...social];
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const commands = useMemo(() => buildCommands(router), [router]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) =>
      q.split(/\s+/).every((part) => `${c.label} ${c.group} ${c.hint ?? ""} ${c.keywords ?? ""}`.toLowerCase().includes(part)),
    );
  }, [commands, query]);

  // Every open starts from a clean search.
  const show = (next: boolean | ((prev: boolean) => boolean)) => {
    setQuery("");
    setActive(0);
    setOpen(next);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        show((v) => !v);
      }
    };
    const onOpen = () => show(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(EVENTS.openPalette, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(EVENTS.openPalette, onOpen);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const run = (cmd?: Command) => {
    if (!cmd) return;
    setOpen(false);
    setTimeout(cmd.run, 60);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (a + 1) % Math.max(results.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (a - 1 + results.length) % Math.max(results.length, 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      run(results[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[14vh]">
          <motion.div
            className="absolute inset-0 bg-bg/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command menu"
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.18 }}
            className="glass-strong relative w-full max-w-xl overflow-hidden rounded-2xl border border-line-strong shadow-[0_40px_120px_-30px_rgb(0_0_0/0.7)]"
            onKeyDown={onKeyDown}
          >
            <div className="flex items-center gap-3 border-b border-line px-4">
              <Search size={17} className="text-subtle" />
              <input
                autoFocus
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                placeholder="Search sections, projects, actions…"
                className="h-14 flex-1 bg-transparent text-[15px] outline-none placeholder:text-subtle focus-visible:outline-none"
                role="combobox"
                aria-expanded="true"
                aria-controls="command-list"
                aria-activedescendant={results[active] ? `cmd-${results[active].id}` : undefined}
              />
              <kbd className="rounded-md border border-line px-1.5 py-0.5 font-mono text-[10px] text-subtle">ESC</kbd>
            </div>
            <div ref={listRef} id="command-list" role="listbox" className="max-h-[50vh] overflow-y-auto p-2">
              {results.length === 0 && <p className="px-3 py-10 text-center text-sm text-subtle">No results for “{query}”.</p>}
              {results.map((cmd, i) => {
                const header = i === 0 || results[i - 1].group !== cmd.group ? cmd.group : null;
                const Icon = cmd.icon;
                return (
                  <div key={cmd.id}>
                    {header && <p className="px-3 pt-3 pb-1.5 font-mono text-[10px] tracking-widest text-subtle uppercase">{header}</p>}
                    <button
                      id={`cmd-${cmd.id}`}
                      role="option"
                      aria-selected={i === active}
                      data-index={i}
                      onMouseMove={() => setActive(i)}
                      onClick={() => run(cmd)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                        i === active ? "bg-surface-2 text-fg" : "text-muted"
                      }`}
                    >
                      <span
                        className={`grid size-8 place-items-center rounded-lg border ${
                          i === active ? "border-accent/40 bg-accent/10 text-accent" : "border-line text-subtle"
                        }`}
                      >
                        <Icon size={15} />
                      </span>
                      <span className="flex-1">{cmd.label}</span>
                      {cmd.hint && <span className="font-mono text-xs text-subtle">{cmd.hint}</span>}
                      {i === active && <CornerDownLeft size={14} className="text-subtle" />}
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-4 border-t border-line px-4 py-2.5 font-mono text-[10px] text-subtle">
              <span>↑↓ navigate</span>
              <span>↵ select</span>
              <span className="ml-auto">⌘K / Ctrl K to toggle</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
