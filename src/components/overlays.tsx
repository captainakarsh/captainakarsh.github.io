"use client";

import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { EVENTS, type ToastTone } from "@/lib/events";
import { Check, Sparkles, X } from "./icons";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-accent via-accent-2 to-accent-3"
    />
  );
}

type Toast = { id: number; message: string; tone: ToastTone };

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  useEffect(() => {
    let n = 0;
    const onToast = (e: Event) => {
      const { message, tone } = (e as CustomEvent<{ message: string; tone: ToastTone }>).detail;
      const id = ++n;
      setToasts((t) => [...t.slice(-2), { id, message, tone }]);
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
    };
    window.addEventListener(EVENTS.toast, onToast);
    return () => window.removeEventListener(EVENTS.toast, onToast);
  }, []);

  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 top-20 z-[80] flex flex-col items-center gap-2 px-4">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: -16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            className="glass pointer-events-auto flex items-center gap-2.5 rounded-full border border-line-strong py-2 pr-4 pl-2 text-sm shadow-card"
          >
            <span
              className={`grid size-6 place-items-center rounded-full ${
                t.tone === "success"
                  ? "bg-success/15 text-success"
                  : t.tone === "error"
                    ? "bg-accent-3/15 text-accent-3"
                    : "bg-accent/15 text-accent"
              }`}
            >
              {t.tone === "success" ? <Check size={13} /> : t.tone === "error" ? <X size={13} /> : <Sparkles size={13} />}
            </span>
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
