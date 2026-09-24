import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative grid min-h-dvh place-items-center overflow-hidden px-6">
      <div aria-hidden className="bg-grid mask-radial absolute inset-0 -z-10" />
      <div aria-hidden className="absolute top-1/3 left-1/2 -z-10 size-96 -translate-x-1/2 rounded-full bg-accent/20 blur-[100px]" />
      <div className="text-center">
        <p className="font-mono text-sm text-accent">404 · route not found</p>
        <h1 className="text-fade mt-4 text-7xl font-semibold tracking-tighter md:text-9xl">Lost?</h1>
        <p className="mx-auto mt-5 max-w-md text-muted">
          This page isn&apos;t deployed in any region. Let&apos;s get you back to something that is.
        </p>
        <pre className="mx-auto mt-8 w-fit rounded-xl border border-line bg-surface px-4 py-3 text-left font-mono text-xs text-subtle">
          <span className="text-accent-3">GET</span> {"<this-url>"} <span className="text-warn">→ 404</span>
          {"\n"}
          <span className="text-success">hint:</span> try the homepage
        </pre>
        <Link
          href="/"
          className="mt-10 inline-flex h-12 items-center rounded-2xl bg-fg px-6 text-sm font-medium text-bg transition-transform hover:scale-[1.03]"
        >
          Take me home
        </Link>
      </div>
    </main>
  );
}
