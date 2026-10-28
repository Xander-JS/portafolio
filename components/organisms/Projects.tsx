"use client";

import { useTranslations } from "next-intl";
import { Section } from "@/components/atoms/Section";
import { SectionHeading } from "@/components/atoms/SectionHeading";
import { ProjectCard } from "@/components/molecules/ProjectCard";
import { projects } from "@/data/projects";

export function Projects() {
  const t = useTranslations("projects");
  return (
    <Section id="projects">
      <SectionHeading id="projects-title" title={t("heading")} intro={t("intro")} />
      <div className="grid gap-5 md:grid-cols-2 lg:gap-6">
        {projects.map((p, i) => (
          <ProjectCard key={p.id} project={p} featured={i === 0} />
        ))}
      </div>
    </Section>
  );
}
