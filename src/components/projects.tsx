"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { projects, type Project, type ProjectCategory } from "@/data/profile";
import { openChat } from "@/lib/events";
import { ArrowUpRight, Sparkles } from "./icons";
import { AxaPdfVisual, NonrixVisual } from "./project-visuals";
import { Chip, Metrics, Reveal, SectionHeading, Serif, SpotlightCard } from "./ui";

const FILTERS: { id: "all" | ProjectCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "saas", label: "SaaS products" },
  { id: "enterprise", label: "Enterprise" },
  { id: "fullstack", label: "Full-stack" },
];

const VISUALS: Record<string, () => React.ReactNode> = {
  axapdf: () => <AxaPdfVisual />,
  nonrix: () => <NonrixVisual />,
};

function FeaturedProject({ project, flip }: { project: Project; flip: boolean }) {
  const Visual = VISUALS[project.slug];
  return (
    <SpotlightCard className="overflow-hidden">
      <div className={`grid lg:grid-cols-2 ${flip ? "lg:[&>*:first-child]:order-2" : ""}`}>
        <div className="flex flex-col p-7 md:p-10">
          <div className="flex items-center gap-3 font-mono text-xs text-subtle">
            <span className="rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-accent">Featured</span>
            {project.period}
          </div>
          <h3 className="mt-5 text-3xl font-semibold tracking-tight md:text-4xl">{project.name}</h3>
          <p className="mt-1 text-lg text-muted">{project.tagline}</p>

          {project.metrics && (
            <dl className="mt-6 grid grid-cols-3 gap-3">
              {project.metrics.map((m) => (
                <div key={m.label} className="flex flex-col-reverse rounded-2xl border border-line bg-surface p-3">
                  <dt className="mt-0.5 text-xs text-subtle">{m.label}</dt>
                  <dd className="text-base font-semibold tracking-tight md:text-lg">{m.value}</dd>
                </div>
              ))}
            </dl>
          )}

          <ul className="mt-6 space-y-2.5">
            {project.highlights.map((h) => (
              <li key={h} className="flex gap-3 text-[15px] leading-relaxed text-pretty text-muted">
                <span aria-hidden className="mt-[9px] size-1.5 shrink-0 rounded-full bg-accent/70" />
                <span>
                  <Metrics text={h} />
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap gap-2">
            {project.stack.map((s) => (
              <Chip key={s}>{s}</Chip>
            ))}
          </div>

          <div className="mt-auto flex flex-wrap items-center gap-3 pt-8">
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex h-11 items-center gap-2 rounded-xl bg-fg px-5 text-sm font-medium text-bg transition-transform hover:scale-[1.03] active:scale-[0.98]"
              >
                Visit {project.urlLabel}
                <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            )}
            <button
              type="button"
              onClick={() => openChat(`Tell me more about how Akarsh built ${project.name}.`)}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-line px-4 text-sm text-muted transition-colors hover:border-line-strong hover:text-fg"
            >
              <Sparkles size={15} className="text-accent" /> Ask AI about it
            </button>
          </div>
        </div>

        <div className="relative border-t border-line bg-bg-soft/50 lg:border-t-0 lg:border-l">
          <div className="bg-grid absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_center,#000,transparent_75%)]" />
          <div className="relative h-full">{Visual ? Visual() : null}</div>
        </div>
      </div>
    </SpotlightCard>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <SpotlightCard className="flex h-full flex-col p-6 md:p-7">
      <div className="flex items-center justify-between font-mono text-xs text-subtle">
        <span className="capitalize">{project.category === "fullstack" ? "Full-stack" : project.category}</span>
        <span>{project.period}</span>
      </div>
      <h3 className="mt-5 text-xl font-semibold tracking-tight">{project.name}</h3>
      <p className="mt-1 text-muted">{project.tagline}</p>
      <ul className="mt-5 space-y-2.5">
        {project.highlights.map((h) => (
          <li key={h} className="flex gap-3 text-sm leading-relaxed text-pretty text-muted">
            <span aria-hidden className="mt-[8px] size-1 shrink-0 rounded-full bg-accent/70" />
            <span>
              <Metrics text={h} />
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-auto flex flex-wrap gap-2 pt-6">
        {project.stack.map((s) => (
          <Chip key={s}>{s}</Chip>
        ))}
      </div>
    </SpotlightCard>
  );
}

export function Projects() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const visible = projects.filter((p) => filter === "all" || p.category === filter);
  const featured = visible.filter((p) => p.featured);
  const rest = visible.filter((p) => !p.featured);

  return (
    <section id="projects" className="relative mx-auto max-w-6xl scroll-mt-24 px-5 py-24 sm:px-8 md:py-32">
      <SectionHeading
        index="03"
        eyebrow="Selected work"
        title={
          <>
            Products I&apos;ve <Serif gradient>built</Serif> &amp; shipped.
          </>
        }
        description="From solo-built AI SaaS serving real users to enterprise tooling used by global clients."
      />

      <Reveal className="mb-10">
        <div role="tablist" aria-label="Filter projects" className="inline-flex flex-wrap gap-1 rounded-2xl border border-line bg-surface p-1">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              role="tab"
              aria-selected={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={`relative isolate rounded-xl px-4 py-2 text-sm transition-colors ${
                filter === f.id ? "text-bg" : "text-muted hover:text-fg"
              }`}
            >
              {filter === f.id && (
                <motion.span
                  layoutId="project-filter"
                  className="absolute inset-0 -z-10 rounded-xl bg-fg"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
              <span className="relative">{f.label}</span>
            </button>
          ))}
        </div>
      </Reveal>

      <motion.div layout className="space-y-6">
        <AnimatePresence mode="popLayout">
          {featured.map((p, i) => (
            <motion.div
              key={p.slug}
              layout
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.5 }}
            >
              <FeaturedProject project={p} flip={i % 2 === 1} />
            </motion.div>
          ))}
        </AnimatePresence>

        {rest.length > 0 && (
          <motion.div layout className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {rest.map((p, i) => (
                <motion.div
                  key={p.slug}
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.45, delay: i * 0.06 }}
                >
                  <ProjectCard project={p} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
