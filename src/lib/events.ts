// Tiny window-event bus so far-apart client components (nav, hero, chat,
// command palette, toasts) can talk without a shared React context.

export type ToastTone = "success" | "error" | "info";

export const EVENTS = {
  openChat: "portfolio:open-chat",
  openPalette: "portfolio:open-palette",
  toast: "portfolio:toast",
  theme: "portfolio:theme",
} as const;

export function openChat(prompt?: string) {
  window.dispatchEvent(new CustomEvent(EVENTS.openChat, { detail: { prompt } }));
}

export function openPalette() {
  window.dispatchEvent(new Event(EVENTS.openPalette));
}

export function toast(message: string, tone: ToastTone = "info") {
  window.dispatchEvent(new CustomEvent(EVENTS.toast, { detail: { message, tone } }));
}

export type Theme = "dark" | "light";

export function currentTheme(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export function setTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.add("theme-switching");
  root.dataset.theme = theme;
  try {
    localStorage.setItem("theme", theme);
  } catch {}
  window.dispatchEvent(new CustomEvent(EVENTS.theme, { detail: theme }));
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove("theme-switching")));
}

export function toggleTheme() {
  setTheme(currentTheme() === "dark" ? "light" : "dark");
}

export async function copyText(text: string, label = "Copied to clipboard") {
  try {
    await navigator.clipboard.writeText(text);
    toast(label, "success");
  } catch {
    toast("Couldn't copy — please copy it manually.", "error");
  }
}
