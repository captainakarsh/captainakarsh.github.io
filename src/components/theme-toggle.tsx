"use client";

import { AnimatePresence, motion } from "motion/react";
import { useSyncExternalStore } from "react";
import { currentTheme, EVENTS, toggleTheme } from "@/lib/events";
import { Moon, Sun } from "./icons";

function subscribeTheme(onChange: () => void) {
  window.addEventListener(EVENTS.theme, onChange);
  return () => window.removeEventListener(EVENTS.theme, onChange);
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribeTheme, currentTheme, () => null);

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="relative grid size-9 place-items-center overflow-hidden rounded-xl border border-line bg-surface text-muted transition-colors hover:border-line-strong hover:text-fg"
      aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme ?? "none"}
          initial={{ y: 12, opacity: 0, rotate: -45 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -12, opacity: 0, rotate: 45 }}
          transition={{ duration: 0.2 }}
        >
          {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
