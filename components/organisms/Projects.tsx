"use client";

import { useTranslations } from "next-intl";
import { Section } from "@/components/atoms/Section";
import { SectionHeading } from "@/components/atoms/SectionHeading";
import { ProjectCard } from "@/components/molecules/ProjectCard";
import { projects } from "@/data/projects";

/** `summary` is the home page version, with a link to /projects. Each card opens /projects/<slug>. */
export function Projects({ summary = false }: { summary?: boolean }) {
  const t = useTranslations("projects");
  const tc = useTranslations("common");
  return (
    <Section id="projects">
      <SectionHeading
        id="projects-title"
        title={t("heading")}
        intro={t("intro")}
        level={summary ? 2 : 1}
        more={summary ? { href: "/projects", label: tc("viewMore"), srLabel: tc("viewMoreAbout", { section: t("heading") }) } : undefined}
      />
      <div className="grid gap-5 md:grid-cols-2 lg:gap-6">
        {projects.map((p, i) => (
          <ProjectCard key={p.slug} project={p} featured={i === 0} />
        ))}
      </div>
    </Section>
  );
}
