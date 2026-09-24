"use client";

import { AnimatePresence, motion } from "motion/react";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { profile } from "@/data/profile";
import { EVENTS } from "@/lib/events";
import { apiUrl } from "@/lib/site";
import { ArrowUp, RotateCcw, Sparkles, Square, X } from "./icons";

type Msg = { id: string; role: "user" | "assistant"; content: string; error?: boolean };

const STORAGE_KEY = "portfolio-chat-v1";
const SUGGESTIONS = [
  "What has Akarsh built?",
  "Tell me about AxaPDF",
  "What's his strongest tech stack?",
  "Is he open to new roles?",
];

const uid = () => Math.random().toString(36).slice(2, 10);

// ---- Minimal, safe markdown: paragraphs, "- " lists, **bold**, `code`, links ----

function renderInline(text: string, keyPrefix: string) {
  const out: React.ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\((?:https?:\/\/|mailto:)[^)\s]+\)|https?:\/\/[^\s)]+|[\w.+-]+@[\w-]+\.[\w.-]+)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const tok = m[0];
    const key = `${keyPrefix}-${i++}`;
    if (tok.startsWith("**")) out.push(<strong key={key} className="font-semibold text-fg">{tok.slice(2, -2)}</strong>);
    else if (tok.startsWith("`")) out.push(<code key={key}>{tok.slice(1, -1)}</code>);
    else if (tok.startsWith("[")) {
      const [, label, href] = tok.match(/^\[([^\]]+)\]\(([^)]+)\)$/) ?? [];
      out.push(
        <a key={key} href={href} target="_blank" rel="noreferrer">
          {label}
        </a>,
      );
    } else if (tok.includes("@") && !tok.startsWith("http")) {
      const email = tok.replace(/\.$/, "");
      out.push(
        <Fragment key={key}>
          <a href={`mailto:${email}`}>{email}</a>
          {tok.endsWith(".") ? "." : ""}
        </Fragment>,
      );
    } else {
      const href = tok.replace(/[.,]$/, "");
      out.push(
        <Fragment key={key}>
          <a href={href} target="_blank" rel="noreferrer">
            {href.replace(/^https?:\/\//, "")}
          </a>
          {tok.slice(href.length)}
        </Fragment>,
      );
    }
    last = m.index + tok.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function Markdown({ text }: { text: string }) {
  const blocks: React.ReactNode[] = [];
  const lines = text.split("\n");
  let list: string[] = [];
  let para: string[] = [];
  const flushList = () => {
    if (!list.length) return;
    const k = blocks.length;
    blocks.push(
      <ul key={`ul-${k}`}>
        {list.map((l, i) => (
          <li key={i}>{renderInline(l, `li-${k}-${i}`)}</li>
        ))}
      </ul>,
    );
    list = [];
  };
  const flushPara = () => {
    if (!para.length) return;
    const k = blocks.length;
    blocks.push(<p key={`p-${k}`}>{renderInline(para.join(" "), `p-${k}`)}</p>);
    para = [];
  };
  for (const raw of lines) {
    const line = raw.trim();
    const bullet = line.match(/^(?:[-*•]|\d+\.)\s+(.*)$/);
    if (bullet) {
      flushPara();
      list.push(bullet[1]);
    } else if (!line) {
      flushPara();
      flushList();
    } else {
      flushList();
      para.push(line.replace(/^#+\s*/, ""));
    }
  }
  flushPara();
  flushList();
  return <div className="prose-chat">{blocks}</div>;
}

// ---- Widget ---------------------------------------------------------------------

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  // The panel starts closed, so restoring on the client can't cause a hydration mismatch.
  const [messages, setMessages] = useState<Msg[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? "[]") as Msg[];
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesRef = useRef<Msg[]>([]);
  messagesRef.current = messages;

  // Persist the conversation for this tab.
  useEffect(() => {
    if (streaming) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-30)));
    } catch {}
  }, [messages, streaming]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: streaming ? "auto" : "smooth" });
  }, [messages, streaming, open]);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 250);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const send = useCallback(async (text: string) => {
    const content = text.trim();
    if (!content || abortRef.current) return;

    const user: Msg = { id: uid(), role: "user", content };
    const reply: Msg = { id: uid(), role: "assistant", content: "" };
    const history = [...messagesRef.current.filter((m) => !m.error && m.content), user];
    setMessages([...messagesRef.current, user, reply]);
    setInput("");
    setStreaming(true);

    const ctrl = new AbortController();
    abortRef.current = ctrl;
    const update = (fn: (m: Msg) => Msg) =>
      setMessages((prev) => prev.map((m) => (m.id === reply.id ? fn(m) : m)));

    try {
      const res = await fetch(apiUrl("/api/chat"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history.map(({ role, content }) => ({ role, content })) }),
        signal: ctrl.signal,
      });
      if (!res.ok || !res.body) {
        const data = (await res.json().catch(() => ({}))) as { error?: string; code?: string };
        const msg =
          data.code === "not_configured"
            ? `The AI assistant is offline right now. You can reach ${profile.firstName} directly at ${profile.email}.`
            : data.error || "Something went wrong. Please try again.";
        update((m) => ({ ...m, content: msg, error: true }));
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        update((m) => ({ ...m, content: m.content + chunk }));
      }
    } catch (err) {
      if ((err as Error).name === "AbortError") {
        update((m) => (m.content ? m : { ...m, content: "Stopped.", error: true }));
      } else {
        update((m) => ({
          ...m,
          content: `Couldn't reach the assistant. You can email ${profile.firstName} at ${profile.email}.`,
          error: true,
        }));
      }
    } finally {
      abortRef.current = null;
      setStreaming(false);
    }
  }, []);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const prompt = (e as CustomEvent<{ prompt?: string }>).detail?.prompt;
      setOpen(true);
      if (prompt) setTimeout(() => send(prompt), 300);
    };
    window.addEventListener(EVENTS.openChat, onOpen);
    return () => window.removeEventListener(EVENTS.openChat, onOpen);
  }, [send]);

  const reset = () => {
    abortRef.current?.abort();
    setMessages([]);
    inputRef.current?.focus();
  };

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ delay: 0.2 }}
            onClick={() => setOpen(true)}
            className="ring-gradient glass group fixed right-5 bottom-5 z-50 flex h-14 items-center gap-2.5 rounded-full pr-5 pl-4 text-sm font-medium shadow-[0_20px_50px_-15px_var(--accent)] transition-transform hover:scale-[1.04] active:scale-95"
            aria-label="Ask AI about Akarsh"
          >
            <span className="grid size-8 place-items-center rounded-full bg-[linear-gradient(135deg,var(--accent),var(--accent-2))] text-white">
              <Sparkles size={16} className="transition-transform group-hover:rotate-12" />
            </span>
            <span className="hidden sm:inline">Ask AI about me</span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="AI assistant"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ type: "spring", bounce: 0.18, duration: 0.45 }}
            className="glass-strong fixed inset-x-3 bottom-3 z-50 flex h-[min(640px,calc(100dvh-1.5rem))] origin-bottom-right flex-col overflow-hidden rounded-3xl border border-line-strong shadow-[0_40px_100px_-30px_rgb(0_0_0/0.6)] sm:inset-x-auto sm:right-5 sm:bottom-5 sm:w-[410px]"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-line px-4 py-3.5">
              <span className="relative grid size-10 place-items-center rounded-2xl bg-[linear-gradient(135deg,var(--accent),var(--accent-2))] font-mono text-sm font-semibold text-white">
                {profile.initials}
                <span className="absolute -right-0.5 -bottom-0.5 size-3 rounded-full border-2 border-bg bg-success" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">Akarsh&apos;s AI assistant</p>
                <p className="truncate text-xs text-subtle">Grounded in his résumé · DeepSeek</p>
              </div>
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={reset}
                  className="grid size-9 place-items-center rounded-xl text-subtle transition-colors hover:bg-surface-2 hover:text-fg"
                  aria-label="Start a new conversation"
                  title="New conversation"
                >
                  <RotateCcw size={16} />
                </button>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid size-9 place-items-center rounded-xl text-subtle transition-colors hover:bg-surface-2 hover:text-fg"
                aria-label="Close assistant"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-5" aria-live="polite">
              <div className="flex gap-2.5">
                <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-accent/15 text-accent">
                  <Sparkles size={14} />
                </span>
                <div className="rounded-2xl rounded-tl-md border border-line bg-surface px-3.5 py-2.5 text-sm leading-relaxed text-muted">
                  Hi! 👋 I know all about {profile.firstName}&apos;s experience, projects and skills. What would you like to
                  know?
                </div>
              </div>

              {messages.length === 0 && (
                <div className="flex flex-wrap gap-2 pl-9">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      className="rounded-full border border-line bg-surface px-3 py-1.5 text-left text-xs text-muted transition-colors hover:border-accent/50 hover:text-fg"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {messages.map((m) =>
                m.role === "user" ? (
                  <div key={m.id} className="flex justify-end">
                    <div className="max-w-[85%] rounded-2xl rounded-br-md bg-fg px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap text-bg">
                      {m.content}
                    </div>
                  </div>
                ) : (
                  <div key={m.id} className="flex gap-2.5">
                    <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-accent/15 text-accent">
                      <Sparkles size={14} />
                    </span>
                    <div
                      className={`min-w-0 max-w-[88%] rounded-2xl rounded-tl-md border px-3.5 py-2.5 text-sm leading-relaxed ${
                        m.error ? "border-accent-3/30 bg-accent-3/10 text-fg" : "border-line bg-surface text-muted"
                      }`}
                    >
                      {m.content ? (
                        <Markdown text={m.content} />
                      ) : (
                        <span className="flex items-center gap-1 py-1" aria-label="Thinking">
                          {[0, 1, 2].map((d) => (
                            <motion.span
                              key={d}
                              className="size-1.5 rounded-full bg-subtle"
                              animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                              transition={{ duration: 1, repeat: Infinity, delay: d * 0.15 }}
                            />
                          ))}
                        </span>
                      )}
                    </div>
                  </div>
                ),
              )}
            </div>

            {/* Composer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="border-t border-line p-3"
            >
              <div className="flex items-end gap-2 rounded-2xl border border-line bg-bg/60 p-1.5 pl-3.5 transition-colors focus-within:border-accent/50">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                      e.preventDefault();
                      send(input);
                    }
                  }}
                  rows={1}
                  maxLength={1500}
                  placeholder="Ask about projects, stack, experience…"
                  className="max-h-32 min-h-[40px] flex-1 resize-none bg-transparent py-2 text-sm outline-none placeholder:text-subtle focus-visible:outline-none [field-sizing:content]"
                  aria-label="Your question"
                />
                {streaming ? (
                  <button
                    type="button"
                    onClick={() => abortRef.current?.abort()}
                    className="grid size-10 shrink-0 place-items-center rounded-xl bg-surface-2 text-fg"
                    aria-label="Stop generating"
                  >
                    <Square size={14} fill="currentColor" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    className="grid size-10 shrink-0 place-items-center rounded-xl bg-fg text-bg transition-all hover:scale-105 disabled:scale-100 disabled:opacity-30"
                    aria-label="Send"
                  >
                    <ArrowUp size={17} />
                  </button>
                )}
              </div>
              <p className="mt-2 text-center text-[11px] text-subtle">AI can make mistakes — confirm important details with Akarsh.</p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
