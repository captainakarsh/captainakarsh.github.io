import { About } from "@/components/about";
import { ChatWidget } from "@/components/chat";
import { CommandPalette } from "@/components/command-palette";
import { Contact } from "@/components/contact";
import { Experience } from "@/components/experience";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Marquee } from "@/components/marquee";
import { Nav } from "@/components/nav";
import { ScrollProgress, Toaster } from "@/components/overlays";
import { Projects } from "@/components/projects";
import { Skills } from "@/components/skills";
import { education, experience, profile } from "@/data/profile";
import { SITE_URL } from "@/lib/site";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  url: SITE_URL,
  jobTitle: profile.role,
  email: `mailto:${profile.email}`,
  description: profile.summary,
  address: { "@type": "PostalAddress", addressLocality: "Greater Noida", addressRegion: "UP", addressCountry: "IN" },
  worksFor: { "@type": "Organization", name: experience[0].company },
  alumniOf: { "@type": "CollegeOrUniversity", name: education.school },
  sameAs: Object.values(profile.socials).filter(Boolean),
  knowsAbout: ["Java", "Spring Boot", "Node.js", "React", "Google Cloud Platform", "Generative AI", "SaaS"],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}
      />
      <a
        href="#about"
        className="sr-only z-[90] rounded-lg bg-fg px-4 py-2 text-bg focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        Skip to content
      </a>
      <ScrollProgress />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <Footer />
      <ChatWidget />
      <CommandPalette />
      <Toaster />
    </>
  );
}
