"use client";

import { useTranslations } from "next-intl";
import { Section } from "@/components/atoms/Section";
import { ModuleHeading } from "@/components/molecules/ModuleHeading";
import { SkillItem } from "@/components/molecules/SkillItem";
import { skillGroups, toolGroups } from "@/data/skills";

/** `summary` is the home page version: every tool as a logo strip, with a link to /skills. */
export function Skills({ summary = false }: { summary?: boolean }) {
  const t = useTranslations("skills");
  return (
    <Section id="skills">
      <ModuleHeading id="skills" summary={summary} />
      {summary ? (
        <ul className="flex flex-wrap gap-2.5">
          {toolGroups.flatMap((g) => g.skills).map((s) => (
            <SkillItem key={s.id} icon={s.icon} label={t(`items.${s.id}`)} compact />
          ))}
        </ul>
      ) : (
        <div className="space-y-12">
          {skillGroups.map((group) => (
            <div key={group.id} className="grid gap-5 md:grid-cols-[12rem_1fr] md:gap-10">
              <h2 className="text-lg font-medium text-ink md:pt-5">{t(`groups.${group.id}`)}</h2>
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {group.skills.map((s) => (
                  <SkillItem key={s.id} icon={s.icon} label={t(`items.${s.id}`)} />
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}
