"use client";

import { useSyncExternalStore } from "react";
import { achievements, education, experience, profile, projects } from "@/data/profile";
import { ArrowUpRight, Award, Briefcase, GraduationCap, Layers, MapPin, Star, Trophy } from "./icons";
import { Reveal, SectionHeading, Serif, SpotlightCard, StatusDot } from "./ui";

const subscribeClock = (tick: () => void) => {
  const id = setInterval(tick, 1000);
  return () => clearInterval(id);
};

function LocalTime() {
  // Whole seconds keep the snapshot stable between ticks; null on the server avoids hydration drift.
  const seconds = useSyncExternalStore(subscribeClock, () => Math.floor(Date.now() / 1000), () => null);
  const now = seconds === null ? null : new Date(seconds * 1000);

  const fmt = (opts: Intl.DateTimeFormatOptions) =>
    now ? new Intl.DateTimeFormat("en-IN", { timeZone: profile.timezone, ...opts }).format(now) : "--:--";
  const hour = now ? Number(fmt({ hour: "numeric", hourCycle: "h23" })) : 12;
  const awake = hour >= 8 && hour < 24;

  return (
    <div>
      <p className="font-mono text-4xl font-medium tracking-tight tabular-nums">
        {fmt({ hour: "2-digit", minute: "2-digit", hourCycle: "h23" })}
        <span className="ml-1 animate-blink text-accent">:</span>
        <span className="text-2xl text-subtle">{now ? fmt({ second: "2-digit" }).padStart(2, "0") : "--"}</span>
      </p>
      <p className="mt-1 flex items-center gap-2 text-sm text-subtle">
        <StatusDot tone={awake ? "success" : "muted"} />
        IST (UTC+5:30) · {awake ? "probably online" : "probably asleep"}
      </p>
    </div>
  );
}

function OrbitGlobe() {
  return (
    <div aria-hidden className="pointer-events-none absolute -right-10 -bottom-16 size-56 opacity-70">
      <div className="absolute inset-0 rounded-full border border-line" />
      <div className="absolute inset-6 rounded-full border border-line" />
      <div className="absolute inset-12 rounded-full border border-dashed border-line-strong" />
      <div className="absolute inset-0 animate-[spin_24s_linear_infinite]">
        <span className="absolute top-1/2 -left-1 size-2 rounded-full bg-accent shadow-[0_0_20px_4px_var(--accent)]" />
      </div>
      <div className="absolute inset-6 animate-[spin_16s_linear_infinite_reverse]">
        <span className="absolute -top-1 left-1/2 size-1.5 rounded-full bg-accent-2 shadow-[0_0_16px_3px_var(--accent-2)]" />
      </div>
    </div>
  );
}

export function About() {
  const current = experience.find((e) => e.current);
  const saas = projects.filter((p) => p.category === "saas");
  const codechef = achievements.find((a) => a.title === "CodeChef Expert");
  const cert = achievements.find((a) => a.kind === "certification");

  return (
    <section id="about" className="relative mx-auto max-w-6xl scroll-mt-24 px-5 py-24 sm:px-8 md:py-32">
      <SectionHeading
        index="01"
        eyebrow="About"
        title={
          <>
            Engineer by trade, <Serif gradient>builder</Serif> at heart.
          </>
        }
      />

      <div className="grid auto-rows-[minmax(180px,auto)] gap-4 md:grid-cols-6">
        <Reveal className="md:col-span-4 md:row-span-2">
          <SpotlightCard className="h-full p-7 md:p-9">
            <div className="space-y-5 text-lg leading-relaxed text-pretty text-muted">
              {profile.about.map((p, i) => (
                <p key={i} className={i === 0 ? "text-xl text-fg md:text-2xl md:leading-snug" : ""}>
                  {p}
                </p>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {["Product-minded", "End-to-end ownership", "Performance", "Clean APIs", "DX"].map((t) => (
                <span key={t} className="rounded-full border border-line px-3 py-1 text-xs text-subtle">
                  {t}
                </span>
              ))}
            </div>
          </SpotlightCard>
        </Reveal>

        {current && (
          <Reveal delay={0.08} className="md:col-span-2">
            <SpotlightCard className="flex h-full flex-col justify-between p-6">
              <div className="flex items-center justify-between text-subtle">
                <span className="flex items-center gap-2 font-mono text-xs tracking-widest uppercase">
                  <Briefcase size={14} /> Currently
                </span>
                <StatusDot />
              </div>
              <div className="mt-6">
                <p className="text-xl font-semibold tracking-tight">{current.role}</p>
                <p className="mt-1 text-muted">{current.company}</p>
                <p className="mt-3 font-mono text-xs text-subtle">
                  {current.start} — {current.end}
                </p>
              </div>
            </SpotlightCard>
          </Reveal>
        )}

        <Reveal delay={0.14} className="md:col-span-2">
          <SpotlightCard className="relative flex h-full flex-col justify-between overflow-hidden p-6">
            <OrbitGlobe />
            <span className="flex items-center gap-2 font-mono text-xs tracking-widest text-subtle uppercase">
              <MapPin size={14} /> {profile.location}
            </span>
            <div className="relative mt-6">
              <LocalTime />
            </div>
          </SpotlightCard>
        </Reveal>

        <Reveal delay={0.05} className="md:col-span-2">
          <SpotlightCard className="flex h-full flex-col justify-between p-6">
            <span className="flex items-center gap-2 font-mono text-xs tracking-widest text-subtle uppercase">
              <Layers size={14} /> Shipped solo
            </span>
            <div className="mt-6">
              <p className="text-5xl font-semibold tracking-tight">
                {saas.length}
                <span className="ml-2 text-base font-normal text-muted">AI SaaS products</span>
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {saas.map((p) => (
                  <a
                    key={p.slug}
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-1 rounded-full border border-line bg-surface px-3 py-1 text-sm transition-colors hover:border-accent/50 hover:text-accent"
                  >
                    {p.name}
                    <ArrowUpRight size={13} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                ))}
              </div>
            </div>
          </SpotlightCard>
        </Reveal>

        {codechef && (
          <Reveal delay={0.1} className="md:col-span-2">
            <SpotlightCard className="flex h-full flex-col justify-between p-6">
              <span className="flex items-center gap-2 font-mono text-xs tracking-widest text-subtle uppercase">
                <Trophy size={14} /> Competitive programming
              </span>
              <div className="mt-6">
                <div className="flex items-center gap-1 text-warn">
                  {Array.from({ length: 4 }, (_, i) => (
                    <Star key={i} size={16} />
                  ))}
                  <Star size={16} className="text-line-strong" />
                </div>
                <p className="mt-2 text-5xl font-semibold tracking-tight">
                  1798
                  <span className="ml-2 text-base font-normal text-muted">CodeChef</span>
                </p>
                <p className="mt-2 text-sm text-subtle">{codechef.detail}</p>
              </div>
            </SpotlightCard>
          </Reveal>
        )}

        <Reveal delay={0.15} className="md:col-span-2">
          <SpotlightCard className="flex h-full flex-col justify-between gap-6 p-6">
            <div>
              <span className="flex items-center gap-2 font-mono text-xs tracking-widest text-subtle uppercase">
                <GraduationCap size={14} /> Education
              </span>
              <p className="mt-4 text-lg font-semibold tracking-tight">{education.degree}</p>
              <p className="text-sm text-muted">
                {education.school} · {education.grade}
              </p>
            </div>
            {cert && "href" in cert && (
              <a
                href={cert.href}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-3 rounded-2xl border border-line bg-surface p-3 transition-colors hover:border-accent/40"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-accent/15 text-accent">
                  <Award size={17} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{cert.title}</span>
                  <span className="block text-xs text-subtle">{cert.detail}</span>
                </span>
                <ArrowUpRight size={15} className="text-subtle transition-colors group-hover:text-accent" />
              </a>
            )}
          </SpotlightCard>
        </Reveal>
      </div>
    </section>
  );
}
