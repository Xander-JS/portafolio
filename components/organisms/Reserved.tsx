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
          <div className="rounded-3xl border border-transparent bg-transparent shadow-[0_0_12px_rgba(0,0,0,0.08),0_4px_14px_-2px_rgba(0,0,0,0.16)] dark:shadow-[0_0_12px_rgba(255,255,255,0.08),0_4px_14px_-2px_rgba(255,255,255,0.12)] p-8 text-ink md:p-10">
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
