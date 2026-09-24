"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { profile } from "@/data/profile";
import { copyText, openChat, toast } from "@/lib/events";
import { apiUrl } from "@/lib/site";
import { ArrowUpRight, Check, Copy, FileText, Github, Linkedin, Loader, Send, Sparkles } from "./icons";
import { Reveal, SectionHeading, Serif, SpotlightCard, StatusDot } from "./ui";

const TOPICS = ["Full-time role", "Freelance project", "Collaboration", "Just saying hi"] as const;
type Status = "idle" | "sending" | "sent" | "error";
type FieldErrors = Partial<Record<"name" | "email" | "message", string>>;

function validate(form: { name: string; email: string; message: string }): FieldErrors {
  const errors: FieldErrors = {};
  if (form.name.trim().length < 2) errors.name = "Please enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) errors.email = "Please enter a valid email.";
  if (form.message.trim().length < 10) errors.message = "Tell me a little more (10+ characters).";
  return errors;
}

export function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "", website: "" });
  const [topic, setTopic] = useState<(typeof TOPICS)[number]>(TOPICS[0]);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  const mailto = `mailto:${profile.email}?subject=${encodeURIComponent(`${topic} — ${form.name || "Hello"}`)}&body=${encodeURIComponent(form.message)}`;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const v = validate(form);
    setErrors(v);
    if (Object.keys(v).length) return;

    setStatus("sending");
    setServerError(null);
    try {
      const res = await fetch(apiUrl("/api/contact"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, topic }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string; field?: keyof FieldErrors };
      if (!res.ok) {
        if (data.field) setErrors({ [data.field]: data.error });
        throw new Error(data.error || "Something went wrong.");
      }
      setStatus("sent");
      setForm({ name: "", email: "", message: "", website: "" });
      toast("Message sent — thank you! I'll get back to you soon.", "success");
    } catch (err) {
      setStatus("error");
      setServerError(
        err instanceof TypeError
          ? "Couldn't reach the server. You can email me directly instead."
          : (err as Error).message,
      );
    }
  }

  const field =
    "w-full rounded-xl border bg-bg/60 px-4 py-3 text-[15px] text-fg placeholder:text-subtle outline-none transition-all focus-visible:outline-none focus:border-accent/60 focus:bg-bg focus:ring-4 focus:ring-accent/15";

  return (
    <section id="contact" className="relative mx-auto max-w-6xl scroll-mt-24 px-5 py-24 sm:px-8 md:py-32">
      <div aria-hidden className="absolute inset-x-0 top-1/3 -z-10 mx-auto h-80 max-w-3xl rounded-full bg-accent/15 blur-[120px]" />

      <SectionHeading
        index="05"
        eyebrow="Contact"
        title={
          <>
            Let&apos;s build something <Serif gradient>great</Serif> together.
          </>
        }
        description="Hiring for a role, need a product built end to end, or just want to talk shop? My inbox is open."
      />

      <div className="grid gap-6 lg:grid-cols-5">
        <Reveal className="space-y-4 lg:col-span-2">
          <SpotlightCard className="p-6">
            <p className="font-mono text-xs tracking-widest text-subtle uppercase">Email</p>
            <div className="mt-3 flex items-center justify-between gap-3">
              <a href={`mailto:${profile.email}`} className="truncate text-lg font-medium hover:text-accent">
                {profile.email}
              </a>
              <button
                type="button"
                onClick={() => copyText(profile.email, "Email copied")}
                className="grid size-9 shrink-0 place-items-center rounded-lg border border-line text-muted transition-colors hover:border-line-strong hover:text-fg"
                aria-label="Copy email address"
              >
                <Copy size={15} />
              </button>
            </div>
          </SpotlightCard>

          <SpotlightCard className="p-6">
            <p className="font-mono text-xs tracking-widest text-subtle uppercase">Status</p>
            <p className="mt-3 flex items-center gap-2.5 text-lg font-medium">
              <StatusDot /> Open to opportunities
            </p>
            <p className="mt-1 text-sm text-muted">Full-time roles, freelance builds and interesting collaborations.</p>
          </SpotlightCard>

          <div className="grid grid-cols-2 gap-4">
            <a
              href={profile.socials.github}
              target="_blank"
              rel="noreferrer"
              className="card group flex items-center justify-between rounded-3xl p-5 transition-colors hover:border-line-strong"
            >
              <span className="flex items-center gap-2.5 text-sm font-medium">
                <Github size={18} /> GitHub
              </span>
              <ArrowUpRight size={15} className="text-subtle transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            {profile.socials.linkedin ? (
              <a
                href={profile.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                className="card group flex items-center justify-between rounded-3xl p-5 transition-colors hover:border-line-strong"
              >
                <span className="flex items-center gap-2.5 text-sm font-medium">
                  <Linkedin size={18} /> LinkedIn
                </span>
                <ArrowUpRight size={15} className="text-subtle transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            ) : (
              <a
                href="/resume"
                className="card group flex items-center justify-between rounded-3xl p-5 transition-colors hover:border-line-strong"
              >
                <span className="flex items-center gap-2.5 text-sm font-medium">
                  <FileText size={18} /> Résumé
                </span>
                <ArrowUpRight size={15} className="text-subtle transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            )}
          </div>

          <button
            type="button"
            onClick={() => openChat("Is Akarsh a good fit for a senior full stack role?")}
            className="ring-gradient group flex w-full items-center gap-4 rounded-3xl bg-surface p-5 text-left transition-colors hover:bg-surface-2"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent/15 text-accent">
              <Sparkles size={18} />
            </span>
            <span>
              <span className="block text-sm font-medium">Want a quick answer first?</span>
              <span className="block text-sm text-muted">Ask my AI assistant anything about my work.</span>
            </span>
          </button>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-3">
          <SpotlightCard className="relative overflow-hidden p-6 md:p-8">
            <AnimatePresence mode="wait" initial={false}>
              {status === "sent" ? (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex min-h-[460px] flex-col items-center justify-center text-center"
                >
                  <motion.span
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", bounce: 0.5, delay: 0.1 }}
                    className="grid size-16 place-items-center rounded-2xl bg-success/15 text-success"
                  >
                    <Check size={30} />
                  </motion.span>
                  <h3 className="mt-6 text-2xl font-semibold tracking-tight">Message received.</h3>
                  <p className="mt-2 max-w-sm text-muted">
                    Thanks for reaching out — I read every message and will reply to your inbox soon.
                  </p>
                  <button
                    type="button"
                    onClick={() => setStatus("idle")}
                    className="mt-8 rounded-xl border border-line px-4 py-2 text-sm text-muted hover:text-fg"
                  >
                    Send another
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={onSubmit}
                  noValidate
                  className="space-y-5"
                >
                  <fieldset>
                    <legend className="mb-3 text-sm text-muted">What&apos;s this about?</legend>
                    <div className="flex flex-wrap gap-2">
                      {TOPICS.map((t) => (
                        <button
                          key={t}
                          type="button"
                          aria-pressed={topic === t}
                          onClick={() => setTopic(t)}
                          className={`rounded-full border px-3.5 py-1.5 text-sm transition-all ${
                            topic === t
                              ? "border-accent/60 bg-accent/15 text-fg"
                              : "border-line text-muted hover:border-line-strong hover:text-fg"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-sm text-muted">Name</span>
                      <input
                        name="name"
                        autoComplete="name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Jane Doe"
                        aria-invalid={Boolean(errors.name)}
                        className={`${field} ${errors.name ? "border-accent-3/70" : "border-line"}`}
                      />
                      {errors.name && <span className="mt-1.5 block text-xs text-accent-3">{errors.name}</span>}
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-sm text-muted">Email</span>
                      <input
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="jane@company.com"
                        aria-invalid={Boolean(errors.email)}
                        className={`${field} ${errors.email ? "border-accent-3/70" : "border-line"}`}
                      />
                      {errors.email && <span className="mt-1.5 block text-xs text-accent-3">{errors.email}</span>}
                    </label>
                  </div>

                  <label className="block">
                    <span className="mb-2 flex items-center justify-between text-sm text-muted">
                      Message
                      <span className="font-mono text-xs text-subtle tabular-nums">{form.message.length}/4000</span>
                    </span>
                    <textarea
                      name="message"
                      rows={6}
                      maxLength={4000}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Tell me about the role, the product or the idea…"
                      aria-invalid={Boolean(errors.message)}
                      className={`${field} resize-none ${errors.message ? "border-accent-3/70" : "border-line"}`}
                    />
                    {errors.message && <span className="mt-1.5 block text-xs text-accent-3">{errors.message}</span>}
                  </label>

                  {/* Honeypot: hidden from people, irresistible to bots. */}
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.website}
                    onChange={(e) => setForm({ ...form, website: e.target.value })}
                    className="absolute -left-[9999px] h-0 w-0 opacity-0"
                    aria-hidden
                  />

                  {status === "error" && serverError && (
                    <div role="alert" className="rounded-xl border border-accent-3/30 bg-accent-3/10 px-4 py-3 text-sm">
                      {serverError}{" "}
                      <a href={mailto} className="font-medium text-fg underline underline-offset-4">
                        Open in your email app →
                      </a>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                    <p className="text-xs text-subtle">Your details are only used to reply to you.</p>
                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="group inline-flex h-12 items-center gap-2 rounded-xl bg-fg px-6 text-sm font-medium text-bg shadow-[0_10px_40px_-12px_var(--accent)] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:cursor-wait disabled:opacity-70"
                    >
                      {status === "sending" ? (
                        <>
                          <Loader size={16} className="animate-spin" /> Sending…
                        </>
                      ) : (
                        <>
                          Send message
                          <Send size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </>
                      )}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </SpotlightCard>
        </Reveal>
      </div>
    </section>
  );
}
