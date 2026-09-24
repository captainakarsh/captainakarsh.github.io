"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { FileText, Play, Sparkles } from "./icons";

const LANGS = [
  { name: "हिन्दी", code: "HI", sample: "नमस्ते, दुनिया" },
  { name: "日本語", code: "JA", sample: "こんにちは世界" },
  { name: "Español", code: "ES", sample: "Hola, mundo" },
  { name: "العربية", code: "AR", sample: "مرحبا بالعالم" },
  { name: "Français", code: "FR", sample: "Bonjour le monde" },
  { name: "தமிழ்", code: "TA", sample: "வணக்கம் உலகம்" },
];

function useTicker(length: number, ms: number) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!inView || reduce) return;
    const id = setInterval(() => setI((v) => (v + 1) % length), ms);
    return () => clearInterval(id);
  }, [inView, reduce, length, ms]);
  return { ref, i };
}

function Lines({ widths, className = "" }: { widths: number[]; className?: string }) {
  return (
    <div className="space-y-2">
      {widths.map((w, i) => (
        <div key={i} className={`h-1.5 rounded-full ${className}`} style={{ width: `${w}%` }} />
      ))}
    </div>
  );
}

export function AxaPdfVisual() {
  const { ref, i } = useTicker(LANGS.length, 2200);
  const lang = LANGS[i];
  const page = 38 + i * 11;

  return (
    <div ref={ref} className="relative flex h-full min-h-[320px] flex-col justify-center gap-5 p-6 sm:p-8">
      <div className="flex items-center justify-center gap-3 sm:gap-5">
        {/* Source page */}
        <div className="w-[42%] max-w-[190px] rotate-[-3deg] rounded-xl border border-line bg-bg p-4 shadow-card">
          <div className="mb-3 flex items-center gap-1.5 text-[10px] text-subtle">
            <FileText size={12} /> report.pdf · EN
          </div>
          <div className="mb-3 h-2.5 w-3/4 rounded-full bg-fg/70" />
          <Lines widths={[100, 92, 96, 70]} className="bg-line-strong" />
          <div className="my-3 grid grid-cols-3 gap-1">
            {Array.from({ length: 6 }, (_, k) => (
              <div key={k} className="h-3 rounded-sm bg-surface-2" />
            ))}
          </div>
          <Lines widths={[88, 100, 64]} className="bg-line-strong" />
        </div>

        {/* Arrow */}
        <div className="flex flex-col items-center gap-1 text-accent">
          <Sparkles size={18} />
          <div className="h-px w-8 bg-gradient-to-r from-accent to-accent-2" />
        </div>

        {/* Translated page */}
        <div className="relative w-[42%] max-w-[190px] rotate-[3deg] rounded-xl border border-accent/40 bg-bg p-4 shadow-[0_20px_60px_-20px_var(--accent)]">
          <div className="mb-3 flex items-center justify-between text-[10px] text-subtle">
            <span className="flex items-center gap-1.5">
              <FileText size={12} /> report.pdf
            </span>
            <AnimatePresence mode="wait">
              <motion.span
                key={lang.code}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="rounded bg-accent/15 px-1.5 font-mono text-accent"
              >
                {lang.code}
              </motion.span>
            </AnimatePresence>
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={lang.sample}
              initial={{ opacity: 0, filter: "blur(4px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(4px)" }}
              className="mb-3 truncate text-sm font-semibold"
            >
              {lang.sample}
            </motion.p>
          </AnimatePresence>
          <Lines widths={[100, 92, 96, 70]} className="bg-accent/25" />
          <div className="my-3 grid grid-cols-3 gap-1">
            {Array.from({ length: 6 }, (_, k) => (
              <div key={k} className="h-3 rounded-sm bg-accent/10" />
            ))}
          </div>
          <Lines widths={[88, 100, 64]} className="bg-accent/25" />
        </div>
      </div>

      {/* Progress */}
      <div className="mx-auto w-full max-w-sm rounded-xl border border-line bg-bg/70 p-3 backdrop-blur">
        <div className="mb-2 flex items-center justify-between font-mono text-[11px] text-subtle">
          <span>
            Translating → <span className="text-fg">{lang.name}</span>
          </span>
          <span className="tabular-nums">page {page}/100</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-accent via-accent-2 to-accent-3"
            animate={{ width: `${page}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
}

const QA = [
  { q: "Summarize this lecture", a: "5 key takeaways on distributed caching, with timestamps ↗" },
  { q: "What did they say about Raft?", a: "At 14:32 — leader election needs a majority quorum…" },
  { q: "Make flashcards from this", a: "Created 12 flashcards from the video transcript ✦" },
];

export function NonrixVisual() {
  const { ref, i } = useTicker(QA.length, 3000);
  const qa = QA[i];
  return (
    <div ref={ref} className="relative flex h-full min-h-[320px] items-center justify-center p-6 sm:p-8">
      <div className="w-full max-w-sm space-y-3">
        {/* Video */}
        <div className="relative aspect-video overflow-hidden rounded-xl border border-line bg-[linear-gradient(135deg,color-mix(in_oklab,var(--accent-2)_25%,var(--bg)),color-mix(in_oklab,var(--accent)_25%,var(--bg)))] shadow-card">
          <div className="bg-grid absolute inset-0 opacity-40" />
          <div className="absolute inset-0 grid place-items-center">
            <span className="grid size-12 place-items-center rounded-full bg-fg/90 text-bg shadow-lg">
              <Play size={18} className="translate-x-px" fill="currentColor" />
            </span>
          </div>
          <div className="absolute inset-x-3 bottom-3">
            <div className="h-1 overflow-hidden rounded-full bg-fg/20">
              <motion.div
                className="h-full bg-fg/90"
                animate={{ width: `${30 + i * 22}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <div className="mt-1.5 flex justify-between font-mono text-[10px] text-fg/70">
              <span>lecture-07.mp4</span>
              <span>1.2 GB · streamed</span>
            </div>
          </div>
        </div>

        {/* Chat */}
        <AnimatePresence mode="wait">
          <motion.div
            key={qa.q}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            className="space-y-2"
          >
            <div className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-fg px-3.5 py-2 text-sm text-bg">{qa.q}</div>
            <div className="flex max-w-[92%] gap-2">
              <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-accent/15 text-accent">
                <Sparkles size={14} />
              </span>
              <div className="rounded-2xl rounded-tl-md border border-line bg-bg/80 px-3.5 py-2 text-sm text-muted backdrop-blur">
                {qa.a}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
