"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { useRef } from "react";
import { experience } from "@/data/profile";
import { Chip, Metrics, Reveal, SectionHeading, Serif, SpotlightCard } from "./ui";

export function Experience() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });

  return (
    <section id="experience" className="relative mx-auto max-w-6xl scroll-mt-24 px-5 py-24 sm:px-8 md:py-32">
      <SectionHeading
        index="02"
        eyebrow="Experience"
        title={
          <>
            Where I&apos;ve been <Serif gradient>shipping</Serif>.
          </>
        }
        description="Three-plus years turning requirements into reliable, fast, well-tested software — and the pipelines that deliver it."
      />

      <div ref={ref} className="relative">
        {/* Rail + animated progress */}
        <div aria-hidden className="absolute top-2 bottom-2 left-[7px] w-px bg-line md:left-[calc(25%+7px)]">
          <motion.div style={{ scaleY: progress }} className="h-full w-full origin-top bg-gradient-to-b from-accent via-accent-2 to-accent-3" />
        </div>

        <ol className="relative space-y-10 md:space-y-14">
        {experience.map((job, i) => (
          <Reveal as="li" key={job.role} delay={i * 0.05} className="relative grid gap-4 pl-10 md:grid-cols-4 md:gap-0 md:pl-0">
            <span
              aria-hidden
              className={`absolute top-2 left-0 grid size-[15px] place-items-center rounded-full border md:left-[25%] ${
                job.current ? "border-accent bg-accent/20" : "border-line-strong bg-bg"
              }`}
            >
              <span className={`size-[5px] rounded-full ${job.current ? "bg-accent" : "bg-subtle"}`} />
            </span>

            <div className="md:pt-0.5 md:pr-10 md:text-right">
              <p className="font-mono text-sm text-muted">
                {job.start} — <span className={job.current ? "text-accent" : ""}>{job.end}</span>
              </p>
              <p className="mt-1 text-sm text-subtle">{job.location}</p>
            </div>

            <div className="md:col-span-3 md:pl-10">
              <SpotlightCard className="p-6 md:p-8">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight md:text-2xl">{job.role}</h3>
                    <p className="mt-1 text-muted">{job.company}</p>
                  </div>
                  {job.current && (
                    <span className="rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 font-mono text-[11px] text-accent">
                      Current
                    </span>
                  )}
                </div>
                <p className="mt-4 text-pretty text-muted">{job.summary}</p>
                <ul className="mt-5 space-y-3">
                  {job.highlights.map((h) => (
                    <li key={h} className="flex gap-3 text-[15px] leading-relaxed text-pretty text-muted">
                      <span aria-hidden className="mt-[9px] size-1.5 shrink-0 rounded-full bg-accent/70" />
                      <span>
                        <Metrics text={h} />
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-wrap gap-2">
                  {job.stack.map((s) => (
                    <Chip key={s}>{s}</Chip>
                  ))}
                </div>
              </SpotlightCard>
            </div>
          </Reveal>
        ))}
        </ol>
      </div>
    </section>
  );
}
