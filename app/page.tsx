import { About } from "@/components/organisms/About";
import { Contact } from "@/components/organisms/Contact";
import { Experience } from "@/components/organisms/Experience";
import { Hero } from "@/components/organisms/Hero";
import { ModuleCarousel } from "@/components/organisms/ModuleCarousel";
import { Projects } from "@/components/organisms/Projects";
import { Skills } from "@/components/organisms/Skills";
import { Testimonials } from "@/components/organisms/Testimonials";
import { PortfolioTemplate } from "@/components/templates/PortfolioTemplate";

// Course order. Each section is a summary that links to its own page; the full content lives there.
export default function Home() {
  return (
    <PortfolioTemplate>
      <Hero />
      <ModuleCarousel />
      <About summary />
      <Skills summary />
      <Projects summary />
      <Experience summary />
      <Testimonials summary />
      <Contact />
    </PortfolioTemplate>
  );
}
