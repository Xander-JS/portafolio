"use client";

import { useTranslations } from "next-intl";
import { Section } from "@/components/atoms/Section";
import { AmbientParticles } from "@/components/molecules/AmbientParticles";
import { ModuleHeading } from "@/components/molecules/ModuleHeading";
import { ReactionWall } from "@/components/molecules/ReactionWall";

export function Reserved({ summary = false }: { summary?: boolean }) {
  const t = useTranslations("reactions");

  return (
    <>
      <AmbientParticles />
      <Section id="reserved">
        <ModuleHeading id="reserved" summary={summary} />
        {summary ? (
          <div className="rounded-3xl border border-primary/30 bg-surface/65 p-8 text-ink backdrop-blur-xs md:p-10">
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-primary-text">
              {t("eyebrow")}
            </p>
            <p className="mt-3 max-w-2xl text-xl font-medium tracking-[-0.02em] text-ink md:text-2xl">
              {t("title")}
            </p>
            <p className="mt-3 max-w-[60ch] text-base leading-relaxed text-ink-soft">{t("teaser")}</p>
          </div>
        ) : (
          <ReactionWall />
        )}
      </Section>
    </>
  );
}
