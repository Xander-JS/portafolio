import { cacheLife } from "next/cache";
import { About } from "@/components/organisms/About";
import { Contact } from "@/components/organisms/Contact";
import { Experience } from "@/components/organisms/Experience";
import { Hero } from "@/components/organisms/Hero";
import { Projects } from "@/components/organisms/Projects";
import { Skills } from "@/components/organisms/Skills";
import { Testimonials } from "@/components/organisms/Testimonials";
import { PortfolioTemplate } from "@/components/templates/PortfolioTemplate";

// Captured in the static page and refreshed daily, so the footer year rolls over on its own.
async function currentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

export default async function Home() {
  return (
    <PortfolioTemplate year={await currentYear()}>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Testimonials />
      <Contact />
    </PortfolioTemplate>
  );
}
