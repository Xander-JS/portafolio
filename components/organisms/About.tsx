"use client";

import { useTranslations } from "next-intl";
import { Section } from "@/components/atoms/Section";
import { ModuleHeading } from "@/components/molecules/ModuleHeading";
import { profile } from "@/data/profile";

/** `summary` is the home page version: the lead and the facts, with a link to /about. */
export function About({ summary = false }: { summary?: boolean }) {
  const t = useTranslations("about");
  const facts = [
    [t("facts.from"), `${profile.city}, Nariño`],
    [t("facts.study"), t("facts.studyValue")],
    [t("facts.play"), t("facts.playValue")],
    [t("facts.free"), t("facts.freeValue")],
  ];

  return (
    <Section id="about">
      <ModuleHeading id="about" summary={summary} intro={false} />
      <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
        <div className="space-y-6">
          <p className="text-2xl leading-snug tracking-[-0.015em] text-ink md:text-[2rem]">
            {t("lead", { city: profile.city, university: profile.university })}
          </p>
          {!summary && (
            <>
              <p className="max-w-[62ch] text-lg leading-relaxed text-ink">{t("origin")}</p>
              <p className="max-w-[62ch] text-lg leading-relaxed text-ink">{t("drive")}</p>
              <p className="max-w-[62ch] text-lg leading-relaxed text-ink">{t("character")}</p>
            </>
          )}
        </div>
        <dl className="grid content-start gap-7 self-start rounded-2xl bg-primary p-7 text-primary-foreground md:p-9">
          {facts.map(([term, value]) => (
            <div key={term}>
              <dt className="text-sm">{term}</dt>
              <dd className="mt-1 text-xl font-medium tracking-[-0.015em]">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
}
