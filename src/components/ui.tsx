"use client";

import { motion, useReducedMotion } from "motion/react";
import { useCallback, type ComponentProps, type ReactNode } from "react";

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "article" | "section";
}) {
  const reduce = useReducedMotion();
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial={reduce ? false : { opacity: 0, y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </Comp>
  );
}

export function SpotlightCard({ className = "", children, ...props }: ComponentProps<"div">) {
  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - rect.top}px`);
  }, []);
  return (
    <div onMouseMove={onMove} className={`spotlight card rounded-3xl ${className}`} {...props}>
      {children}
    </div>
  );
}

export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
}: {
  index: string;
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
}) {
  return (
    <Reveal className="mb-12 max-w-3xl md:mb-16">
      <p className="mb-4 flex items-center gap-3 font-mono text-xs tracking-[0.2em] text-subtle uppercase">
        <span className="text-accent">{index}</span>
        <span className="h-px w-8 bg-line-strong" />
        {eyebrow}
      </p>
      <h2 className="text-4xl leading-[1.05] font-semibold tracking-tight text-balance md:text-6xl">{title}</h2>
      {description && <p className="mt-5 max-w-2xl text-lg text-pretty text-muted">{description}</p>}
    </Reveal>
  );
}

export function Serif({ children, gradient = false }: { children: ReactNode; gradient?: boolean }) {
  return (
    <span className={`font-serif font-normal tracking-normal italic ${gradient ? "text-gradient pr-1" : ""}`}>
      {children}
    </span>
  );
}

export function Chip({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-line bg-surface px-2.5 py-1 font-mono text-[11px] text-muted transition-colors ${className}`}
    >
      {children}
    </span>
  );
}

/** Emphasises numbers and percentages inside a sentence (e.g. "30%", "50+", "200+"). */
export function Metrics({ text }: { text: string }) {
  const parts = text.split(/(\d[\d,.]*(?:%|\+)|\d+ (?:days?|minutes?|client environments)|\d{2,})/g);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className="font-medium text-fg">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}

export function StatusDot({ tone = "success" }: { tone?: "success" | "warn" | "muted" }) {
  const color = tone === "success" ? "bg-success" : tone === "warn" ? "bg-warn" : "bg-subtle";
  return (
    <span className="relative inline-flex size-2">
      {tone === "success" && <span className={`absolute inset-0 animate-pulse-ring rounded-full ${color}`} />}
      <span className={`relative inline-flex size-2 rounded-full ${color}`} />
    </span>
  );
}
