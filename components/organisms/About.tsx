"use client";

import { useTranslations } from "next-intl";
import { Glass } from "@/components/atoms/Glass";
import { Section } from "@/components/atoms/Section";
import { SectionHeading } from "@/components/atoms/SectionHeading";
import { profile } from "@/data/profile";

export function About() {
  const t = useTranslations("about");
  const facts = [
    [t("facts.from"), `${profile.city}, Nariño`],
    [t("facts.study"), t("facts.studyValue")],
    [t("facts.play"), t("facts.playValue")],
    [t("facts.free"), t("facts.freeValue")],
  ];

  return (
    <Section id="about">
      <SectionHeading id="about-title" title={t("heading")} />
      <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
        <div className="space-y-6">
          <p className="text-2xl leading-snug tracking-[-0.015em] text-ink md:text-[2rem]">
            {t("lead", { city: profile.city, university: profile.university })}
          </p>
          <p className="max-w-[62ch] text-lg leading-relaxed text-ink">{t("origin")}</p>
          <p className="max-w-[62ch] text-lg leading-relaxed text-ink">{t("drive")}</p>
          <p className="max-w-[62ch] text-lg leading-relaxed text-ink">{t("character")}</p>
        </div>
        <Glass as="dl" className="grid content-start gap-7 self-start p-7 md:p-9">
          {facts.map(([term, value]) => (
            <div key={term}>
              <dt className="text-sm text-ink-faint">{term}</dt>
              <dd className="mt-1 text-xl font-medium tracking-[-0.015em] text-ink">{value}</dd>
            </div>
          ))}
        </Glass>
      </div>
    </Section>
  );
}
