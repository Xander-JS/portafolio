"use client";

import { useTranslations } from "next-intl";
import { Section } from "@/components/atoms/Section";
import { SectionHeading } from "@/components/atoms/SectionHeading";
import { SkillItem } from "@/components/molecules/SkillItem";
import { skillGroups } from "@/data/skills";

export function Skills() {
  const t = useTranslations("skills");
  return (
    <Section id="skills">
      <SectionHeading id="skills-title" title={t("heading")} intro={t("intro")} />
      <div className="space-y-12">
        {skillGroups.map((group) => (
          <div key={group.id} className="grid gap-5 md:grid-cols-[12rem_1fr] md:gap-10">
            <h3 className="text-lg font-medium text-ink md:pt-5">{t(`groups.${group.id}`)}</h3>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {group.skills.map((s) => (
                <SkillItem key={s.id} icon={s.icon} label={t(`items.${s.id}`)} />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
