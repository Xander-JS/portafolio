"use client";

import { Section } from "@/components/atoms/Section";
import { ModuleHeading } from "@/components/molecules/ModuleHeading";
import { ProjectCard } from "@/components/molecules/ProjectCard";
import { projects } from "@/data/projects";

/** `summary` is the home page version, with a link to /projects. Each card opens /projects/<slug>. */
export function Projects({ summary = false }: { summary?: boolean }) {
  return (
    <Section id="projects">
      <ModuleHeading id="projects" summary={summary} />
      <div className="grid gap-5 md:grid-cols-2 lg:gap-6">
        {projects.map((p, i) => (
          <ProjectCard key={p.slug} project={p} featured={i === 0} />
        ))}
      </div>
    </Section>
  );
}
