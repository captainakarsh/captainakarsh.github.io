import { skills } from "@/data/profile";
import { Code, Layers, Server, Sparkles, Terminal, Zap } from "./icons";
import { Reveal, SectionHeading, Serif, SpotlightCard } from "./ui";

const ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  Languages: Code,
  Frameworks: Layers,
  "AI & ML": Sparkles,
  "Cloud & DevOps": Server,
  Data: Zap,
  Tools: Terminal,
};

export function Skills() {
  return (
    <section id="skills" className="relative mx-auto max-w-6xl scroll-mt-24 px-5 py-24 sm:px-8 md:py-32">
      <SectionHeading
        index="04"
        eyebrow="Toolbox"
        title={
          <>
            The stack behind the <Serif gradient>shipping</Serif>.
          </>
        }
        description="Backend-heavy, cloud-native and AI-fluent — with enough frontend craft to own the whole product."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((group, i) => {
          const Icon = ICONS[group.group] ?? Code;
          const highlight = group.group === "AI & ML";
          return (
            <Reveal key={group.group} delay={(i % 3) * 0.07}>
              <SpotlightCard className={`group h-full p-6 ${highlight ? "border-accent/35" : ""}`}>
                <div className="flex items-center justify-between">
                  <span
                    className={`grid size-10 place-items-center rounded-xl border ${
                      highlight ? "border-accent/40 bg-accent/15 text-accent" : "border-line bg-surface-2 text-muted"
                    }`}
                  >
                    <Icon size={18} />
                  </span>
                  <span className="font-mono text-xs text-subtle">
                    {String(group.items.length).padStart(2, "0")} tools
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-semibold tracking-tight">{group.group}</h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-lg border border-line bg-surface px-2.5 py-1.5 text-sm text-muted transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/50 hover:bg-accent/10 hover:text-fg"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </SpotlightCard>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
