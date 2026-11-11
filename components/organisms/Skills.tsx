"use client";

import { useTranslations } from "next-intl";
import { Section } from "@/components/atoms/Section";
import { AmbientParticles } from "@/components/molecules/AmbientParticles";
import { ModuleHeading } from "@/components/molecules/ModuleHeading";
import { SkillItem } from "@/components/molecules/SkillItem";
import { SkillNexus } from "@/components/molecules/SkillNexus";
import { toolGroups } from "@/data/skills";

/** `summary` is the home page version: every tool as a logo strip, with a link to /skills. */
export function Skills({ summary = false }: { summary?: boolean }) {
  const t = useTranslations("skills");
  return (
    <>
      <AmbientParticles />
      <Section id="skills">
      <ModuleHeading id="skills" summary={summary} />
      {summary ? (
        <ul className="flex flex-wrap gap-2.5">
          {toolGroups.flatMap((g) => g.skills).map((s) => (
            <SkillItem key={s.id} icon={s.icon} label={t(`items.${s.id}`)} compact />
          ))}
        </ul>
      ) : (
        <SkillNexus />
      )}
      </Section>
    </>
  );
}
