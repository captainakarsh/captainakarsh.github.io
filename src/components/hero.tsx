"use client";

import {
  animate,
  AnimatePresence,
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { profile } from "@/data/profile";
import { openChat } from "@/lib/events";
import { scrollToId } from "@/lib/site";
import { ArrowRight, FileText, Github, Linkedin, Mail, MapPin, Sparkles } from "./icons";
import { Serif, StatusDot } from "./ui";

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

function fadeUp(delay: number, reduce: boolean | null) {
  return {
    initial: reduce ? false : { opacity: 0, y: 28, filter: "blur(8px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    transition: { duration: 0.9, delay, ease: EASE },
  } as const;
}

function RotatingRole() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % profile.roles.length), 2600);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="relative inline-flex h-[1.5em] w-[20ch] overflow-hidden align-bottom">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={profile.roles[index]}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="absolute left-0 whitespace-nowrap text-fg"
        >
          {profile.roles[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

// ---- Typed code card ------------------------------------------------------

type Tok = [text: string, cls?: string];
const K = "text-accent-3"; // keyword
const P = "text-accent-2"; // property
const S = "text-success"; // string
const C = "text-subtle italic"; // comment
const F = "text-warn"; // function / boolean

const CODE: Tok[] = [
  ["const ", K], ["akarsh", F], [" = {\n"],
  ["  role", P], [": "], ['"Full Stack Engineer"', S], [",\n"],
  ["  experience", P], [": "], ['"3.5+ years"', S], [",\n"],
  ["  backend", P], [": ["], ['"Java"', S], [", "], ['"Spring Boot"', S], [", "], ['"Node.js"', S], ["],\n"],
  ["  frontend", P], [": ["], ['"React"', S], [", "], ['"Next.js"', S], [", "], ['"Flutter"', S], ["],\n"],
  ["  cloud", P], [": ["], ['"GCP"', S], [", "], ['"Cloud Run"', S], [", "], ['"Firebase"', S], ["],\n"],
  ["  ai", P], [": ["], ['"Gemini"', S], [", "], ['"Claude"', S], [", "], ['"LangChain"', S], ["],\n"],
  ["  shipped", P], [": ["], ['"AxaPDF"', S], [", "], ['"NonriX"', S], ["],\n"],
  ["  openToWork", P], [": "], ["true", F], [",\n"],
  ["};\n\n"],
  ["await ", K], ["akarsh", F], ["."], ["build", P], ["("], ["yourIdea", F], [");"], [" // 🚀", C],
];
const TOTAL = CODE.reduce((n, [t]) => n + t.length, 0);
// Character offset at which each token starts.
const OFFSETS = CODE.map((_, i) => CODE.slice(0, i).reduce((n, [t]) => n + t.length, 0));
const LINE_COUNT = CODE.reduce((n, [t]) => n + (t.match(/\n/g)?.length ?? 0), 1);

function CodeCard() {
  const reduce = useReducedMotion();
  const [typed, setTyped] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView || reduce) return;
    let raf = 0;
    const start = performance.now() + 700;
    const tick = (now: number) => {
      const n = Math.max(0, Math.floor((now - start) / 14));
      setTyped(Math.min(n, TOTAL));
      if (n < TOTAL) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce]);

  // Subtle 3D tilt toward the cursor.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 120, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 120, damping: 18 });

  const shown = reduce ? TOTAL : typed;
  const lines = CODE.map(([text, cls], i) =>
    shown > OFFSETS[i] ? (
      <span key={i} className={cls}>
        {text.slice(0, shown - OFFSETS[i])}
      </span>
    ) : null,
  );

  return (
    <motion.div
      ref={ref}
      style={reduce ? undefined : { rotateX: rx, rotateY: ry, transformPerspective: 1200 }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      className="relative"
    >
      <div className="absolute -inset-6 -z-10 rounded-[40px] bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--accent)_30%,transparent),transparent)] opacity-70 blur-2xl" />
      <div className="card overflow-hidden rounded-2xl">
        <div className="flex items-center gap-2 border-b border-line px-4 py-3">
          <span className="size-3 rounded-full bg-[#ff5f57]" />
          <span className="size-3 rounded-full bg-[#febc2e]" />
          <span className="size-3 rounded-full bg-[#28c840]" />
          <span className="ml-3 font-mono text-xs text-subtle">akarsh.ts</span>
        </div>
        <div className="flex gap-4 overflow-x-auto p-4 font-mono text-[12.5px] leading-6 sm:p-5 sm:text-[13px]">
          <div aria-hidden className="text-right text-subtle/60 select-none">
            {Array.from({ length: LINE_COUNT }, (_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
          <pre className="relative min-w-0 flex-1 whitespace-pre text-muted">
            {/* Invisible full copy reserves the final size so layout never jumps. */}
            <span className="invisible" aria-hidden>
              {CODE.map(([t]) => t).join("")}
            </span>
            <code className="absolute inset-0" aria-label="Akarsh's profile as code">
              {lines}
              <span className="ml-px inline-block h-[1.1em] w-[7px] translate-y-[3px] animate-blink bg-accent" />
            </code>
          </pre>
        </div>
      </div>

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="glass absolute -bottom-9 -left-4 hidden items-center gap-2.5 rounded-xl border border-line px-3 py-2 text-xs shadow-card sm:flex"
      >
        <span className="grid size-7 place-items-center rounded-lg bg-success/15 text-success">✓</span>
        <div>
          <p className="font-medium">2 SaaS products live</p>
          <p className="text-subtle">AxaPDF · NonriX</p>
        </div>
      </motion.div>
      <motion.div
        initial={reduce ? false : { opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.7, duration: 0.6 }}
        className="glass absolute -top-5 -right-3 hidden items-center gap-2 rounded-xl border border-line px-3 py-2 font-mono text-[11px] text-muted shadow-card sm:flex"
      >
        <span className="text-accent-2">▲</span> deployed · bom1
      </motion.div>
    </motion.div>
  );
}

// ---- Stats ------------------------------------------------------------------

function CountUp({ value, decimals, suffix }: { value: number; decimals: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const [counted, setCounted] = useState(0);
  const display = reduce ? value : counted;

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, value, { duration: 1.8, ease: [0.16, 1, 0.3, 1], onUpdate: setCounted });
    return () => controls.stop();
  }, [inView, reduce, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}

// ---- Hero ---------------------------------------------------------------------

export function Hero() {
  const reduce = useReducedMotion();
  const gx = useMotionValue(50);
  const gy = useMotionValue(30);
  const glow = useMotionTemplate`radial-gradient(600px circle at ${gx}% ${gy}%, color-mix(in oklab, var(--accent) 14%, transparent), transparent 60%)`;

  return (
    <section
      id="top"
      className="relative isolate overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        gx.set(((e.clientX - r.left) / r.width) * 100);
        gy.set(((e.clientY - r.top) / r.height) * 100);
      }}
    >
      {/* Background layers */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="bg-grid mask-radial absolute inset-0" />
        <div className="absolute -top-40 left-1/2 h-[640px] w-[1100px] -translate-x-1/2 animate-aurora opacity-60 blur-3xl">
          <div className="absolute top-10 left-[10%] size-[420px] rounded-full bg-accent/40" />
          <div className="absolute top-24 right-[12%] size-[380px] rounded-full bg-accent-2/25" />
          <div className="absolute top-52 left-[42%] size-[300px] rounded-full bg-accent-3/20" />
        </div>
        {!reduce && <motion.div className="absolute inset-0" style={{ background: glow }} />}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-bg" />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-16 px-5 sm:px-8 lg:grid-cols-12 lg:gap-10">
        <div className="min-w-0 lg:col-span-7">
          <motion.div {...fadeUp(0.05, reduce)}>
            <span className="inline-flex items-center gap-2.5 rounded-full border border-line bg-surface py-1.5 pr-3.5 pl-3 text-xs text-muted backdrop-blur">
              <StatusDot />
              <span className="text-fg">Available for new opportunities</span>
              <span className="hidden h-3 w-px bg-line-strong sm:block" />
              <span className="hidden items-center gap-1 sm:inline-flex">
                <MapPin size={12} /> {profile.location}
              </span>
            </span>
          </motion.div>

          <motion.h1
            {...fadeUp(0.15, reduce)}
            className="text-fade mt-7 text-[clamp(3.2rem,9vw,6.5rem)] leading-[0.92] font-semibold tracking-[-0.045em]"
          >
            Akarsh
            <br />
            Singh<span className="text-accent">.</span>
          </motion.h1>

          <motion.p
            {...fadeUp(0.28, reduce)}
            className="mt-7 max-w-xl text-xl leading-relaxed text-pretty text-muted md:text-2xl"
          >
            Full stack engineer building <Serif gradient>AI-powered</Serif> products and cloud-native systems that ship
            to real users.
          </motion.p>

          <motion.p {...fadeUp(0.38, reduce)} className="mt-5 flex items-center gap-2 font-mono text-sm text-subtle">
            <span className="text-accent">$</span> focus <span className="text-subtle/60">→</span> <RotatingRole />
          </motion.p>

          <motion.div {...fadeUp(0.48, reduce)} className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                scrollToId("projects");
              }}
              className="group inline-flex h-12 items-center gap-2 rounded-2xl bg-fg px-6 text-sm font-medium text-bg shadow-[0_10px_40px_-10px_var(--accent)] transition-transform hover:scale-[1.03] active:scale-[0.98]"
            >
              Explore my work
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </a>
            <button
              type="button"
              onClick={() => openChat()}
              className="ring-gradient group inline-flex h-12 items-center gap-2 rounded-2xl bg-surface px-5 text-sm font-medium backdrop-blur transition-colors hover:bg-surface-2"
            >
              <Sparkles size={16} className="text-accent transition-transform group-hover:rotate-12" />
              Ask my AI
            </button>
            <a
              href="/resume"
              className="inline-flex h-12 items-center gap-2 rounded-2xl px-4 text-sm text-muted transition-colors hover:text-fg"
            >
              <FileText size={16} /> Résumé
            </a>
          </motion.div>

          <motion.div {...fadeUp(0.58, reduce)} className="mt-10 flex items-center gap-2">
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
                className="grid size-10 place-items-center rounded-xl border border-line bg-surface text-muted transition-all hover:-translate-y-0.5 hover:border-line-strong hover:text-fg"
              >
                <Icon size={17} />
              </a>
            ))}
            <span className="ml-2 font-mono text-xs text-subtle">{profile.email}</span>
          </motion.div>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.35, ease: EASE }}
          className="min-w-0 lg:col-span-5"
        >
          <CodeCard />
        </motion.div>
      </div>

      <motion.dl
        {...fadeUp(0.7, reduce)}
        className="mx-auto mt-20 grid max-w-6xl grid-cols-2 gap-px overflow-hidden px-5 sm:px-8 md:mt-28 md:grid-cols-4"
      >
        {profile.stats.map((s, i) => (
          <div
            key={s.label}
            className={`flex flex-col-reverse border-line py-6 pr-4 ${i % 2 ? "border-l pl-6" : ""} ${
              i >= 2 ? "border-t md:border-t-0" : ""
            } ${i > 0 ? "md:border-l md:pl-8" : ""}`}
          >
            <dt className="mt-2 text-sm text-subtle">{s.label}</dt>
            <dd className="text-4xl font-semibold tracking-tight md:text-5xl">
              <CountUp value={s.value} decimals={s.decimals} suffix={s.suffix} />
            </dd>
          </div>
        ))}
      </motion.dl>
    </section>
  );
}
