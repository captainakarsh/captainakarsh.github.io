import type { Metadata } from "next";
import Link from "next/link";
import { achievements, education, experience, profile, projects, skills } from "@/data/profile";
import { SITE_URL } from "@/lib/site";
import { PrintButton } from "./print-button";

export const metadata: Metadata = {
  title: "Résumé",
  description: `Résumé of ${profile.name}, ${profile.role}.`,
  alternates: { canonical: "/resume" },
};

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-9 mb-4 border-b border-line pb-2 font-mono text-xs tracking-[0.2em] text-subtle uppercase print:mt-5 print:mb-2 print:border-neutral-300 print:text-neutral-500">
      {children}
    </h2>
  );
}

export default function ResumePage() {
  const site = SITE_URL.replace(/^https?:\/\//, "");
  return (
    <div className="min-h-dvh bg-bg-soft py-10 print:bg-white print:py-0">
      <div className="mx-auto mb-6 flex max-w-[850px] items-center justify-between px-5 print:hidden">
        <Link href="/" className="text-sm text-muted transition-colors hover:text-fg">
          ← Back to portfolio
        </Link>
        <PrintButton />
      </div>

      <article className="card mx-auto max-w-[850px] rounded-3xl p-8 md:p-14 print:max-w-none print:rounded-none print:border-0 print:p-0 print:text-[11px] print:shadow-none">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight print:text-3xl">{profile.name}</h1>
            <p className="mt-1 text-lg text-muted">{profile.role}</p>
          </div>
          <ul className="space-y-0.5 text-right text-sm text-muted">
            <li>{profile.location}</li>
            <li>
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
            </li>
            <li>
              <a href={profile.socials.github}>github.com/captainakarsh</a>
            </li>
            {profile.socials.linkedin && (
              <li>
                <a href={profile.socials.linkedin}>{profile.socials.linkedin.replace(/^https?:\/\/(www\.)?/, "")}</a>
              </li>
            )}
            <li>
              <a href={SITE_URL}>{site}</a>
            </li>
          </ul>
        </header>

        <Heading>Summary</Heading>
        <p className="leading-relaxed text-muted">{profile.summary}</p>

        <Heading>Experience</Heading>
        <div className="space-y-6 print:space-y-3">
          {experience.map((job) => (
            <section key={job.role}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-semibold">
                  {job.role} · <span className="font-normal text-muted">{job.company}</span>
                </h3>
                <p className="font-mono text-xs text-subtle">
                  {job.start} – {job.end} · {job.location}
                </p>
              </div>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted marker:text-subtle">
                {job.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <Heading>Projects</Heading>
        <div className="space-y-5 print:space-y-3">
          {projects.map((p) => (
            <section key={p.slug} className="break-inside-avoid">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-semibold">
                  {p.name} · <span className="font-normal text-muted">{p.tagline}</span>
                  {p.url && (
                    <a href={p.url} className="ml-2 text-sm font-normal text-accent">
                      {p.urlLabel}
                    </a>
                  )}
                </h3>
                <p className="font-mono text-xs text-subtle">{p.period}</p>
              </div>
              <p className="mt-1 font-mono text-xs text-subtle">{p.stack.join(" · ")}</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted marker:text-subtle">
                {p.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <Heading>Skills</Heading>
        <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-[140px_1fr]">
          {skills.map((s) => (
            <div key={s.group} className="contents">
              <dt className="font-medium">{s.group}</dt>
              <dd className="text-muted">{s.items.join(", ")}</dd>
            </div>
          ))}
        </dl>

        <div className="grid gap-x-10 sm:grid-cols-2">
          <div>
            <Heading>Education</Heading>
            <p className="font-semibold">{education.school}</p>
            <p className="text-sm text-muted">
              {education.degree} · {education.grade}
            </p>
            <p className="font-mono text-xs text-subtle">{education.period}</p>
          </div>
          <div>
            <Heading>Achievements</Heading>
            <ul className="space-y-2 text-sm">
              {achievements.map((a) => (
                <li key={a.title}>
                  <span className="font-semibold">{a.title}</span>
                  <span className="text-muted"> — {a.detail}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </article>
    </div>
  );
}
