import { About } from "@/components/organisms/About";
import { Contact } from "@/components/organisms/Contact";
import { Experience } from "@/components/organisms/Experience";
import { Hero } from "@/components/organisms/Hero";
import { ModuleDrum } from "@/components/organisms/ModuleDrum";
import { Projects } from "@/components/organisms/Projects";
import { Skills } from "@/components/organisms/Skills";
import { Testimonials } from "@/components/organisms/Testimonials";
import { PortfolioTemplate } from "@/components/templates/PortfolioTemplate";
import { modules } from "@/data/modules";
import type { PortfolioModule } from "@/data/types";
import type { ReactNode } from "react";

// One section per module, in the order of data/modules.ts (the course order), so the drum and the page never drift.
const sections = { about: About, skills: Skills, projects: Projects, experience: Experience, testimonials: Testimonials, contact: Contact } satisfies Record<
  PortfolioModule["id"],
  (props: { summary?: boolean }) => ReactNode
>;

export default function Home() {
  return (
    <PortfolioTemplate>
      <Hero />
      <ModuleDrum />
      {modules.map((m) => {
        const Section = sections[m.id];
        return <Section key={m.id} summary />;
      })}
    </PortfolioTemplate>
  );
}
