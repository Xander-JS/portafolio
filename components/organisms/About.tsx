"use client";

import { useTranslations } from "next-intl";
import { Section } from "@/components/atoms/Section";
import { ModuleHeading } from "@/components/molecules/ModuleHeading";
import { NodeReconstruction } from "@/components/molecules/NodeReconstruction";
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
    <Section id="about" className="[&>*]:!animate-none">
      <NodeReconstruction>
        <ModuleHeading id="about" summary={summary} intro={false} />
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
          <div className="space-y-6">
            <p
              data-node-text="lead"
              className="text-2xl leading-snug tracking-[-0.015em] text-ink md:text-[2rem]"
            >
              {t("lead", { city: profile.city, university: profile.university })}
            </p>
            <div data-node-line aria-hidden className="h-px w-24 bg-primary/30" />
            {!summary && (
              <>
                <p
                  data-node-text="body"
                  className="max-w-[62ch] text-lg leading-relaxed text-ink"
                >
                  {t("origin")}
                </p>
                <p
                  data-node-text="body"
                  className="max-w-[62ch] text-lg leading-relaxed text-ink"
                >
                  {t("drive")}
                </p>
                <p
                  data-node-text="body"
                  className="max-w-[62ch] text-lg leading-relaxed text-ink"
                >
                  {t("character")}
                </p>
              </>
            )}
          </div>
          <dl
            data-node-box
            className="grid content-start gap-6 self-start rounded-2xl border border-primary/35 bg-surface/65 p-7 text-ink backdrop-blur-xs md:p-9"
          >
            {facts.map(([term, value], idx) => (
              <div key={term}>
                <dt
                  data-node-text="term"
                  className="font-mono text-xs font-semibold uppercase tracking-wider text-primary-text"
                >
                  {term}
                </dt>
                <dd
                  data-node-text="value"
                  className="mt-1.5 text-xl font-medium tracking-[-0.015em] text-ink"
                >
                  {value}
                </dd>
                {idx < facts.length - 1 && (
                  <div
                    data-node-line
                    aria-hidden
                    className="mt-5 h-px w-full bg-primary/20"
                  />
                )}
              </div>
            ))}
          </dl>
        </div>
      </NodeReconstruction>
    </Section>
  );
}
