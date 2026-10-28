"use client";

import { useTranslations } from "next-intl";
import { Section } from "@/components/atoms/Section";
import { SectionHeading } from "@/components/atoms/SectionHeading";
import { ExperienceItem } from "@/components/molecules/ExperienceItem";
import { experience } from "@/data/experience";

export function Experience() {
  const t = useTranslations("experience");
  return (
    <Section id="experience">
      <SectionHeading id="experience-title" title={t("heading")} intro={t("intro")} />
      <ol className="divide-y divide-ink/10">
        {experience.map((item) => (
          <ExperienceItem key={item.id} item={item} />
        ))}
      </ol>
    </Section>
  );
}
