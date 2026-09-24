import { marquee } from "@/data/profile";

export function Marquee() {
  const items = [...marquee, ...marquee];
  return (
    <div className="relative border-y border-line bg-bg-soft/40 py-5" aria-label="Technologies I work with">
      <div className="mask-fade-x flex overflow-hidden">
        <ul className="flex shrink-0 animate-marquee items-center gap-10 pr-10 hover:[animation-play-state:paused]">
          {items.map((item, i) => (
            <li
              key={i}
              aria-hidden={i >= marquee.length}
              className="flex items-center gap-10 font-mono text-sm whitespace-nowrap text-subtle transition-colors hover:text-fg"
            >
              {item}
              <span className="text-accent/60">✦</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
