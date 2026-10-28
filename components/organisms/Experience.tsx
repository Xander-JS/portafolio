"use client";

import { CalendarDays } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, useState, type KeyboardEvent } from "react";
import { Section } from "@/components/atoms/Section";
import { ModuleHeading } from "@/components/molecules/ModuleHeading";
import { ExperienceItem } from "@/components/molecules/ExperienceItem";
import { academic, seminars, work } from "@/data/experience";
import { useLocale } from "@/i18n/Providers";

const tabs = ["work", "academic"] as const;

/** Work and academic timelines in two tabs. `summary` (home page) shows the first entry of each, with a link to /experience. */
export function Experience({ summary = false }: { summary?: boolean }) {
  const t = useTranslations("experience");
  const locale = useLocale();
  const [tab, setTab] = useState<(typeof tabs)[number]>("work");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const workItems = (summary ? work.slice(0, 2) : work).map((w, i) => (
    <ExperienceItem
      key={w.id}
      icon={w.icon}
      badge={t(`kind.${w.kind}`)}
      title={w.role[locale]}
      place={w.place[locale]}
      period={w.period[locale]}
      summary={summary ? undefined : w.summary[locale]}
      skills={summary ? undefined : w.skills.map((s) => s[locale])}
      skillsLabel={t("skillsLabel")}
      accent={i === 0}
    />
  ));
  const academicItems = academic.map((a, i) => (
    <ExperienceItem
      key={a.id}
      icon="graduation"
      badge={t("studies")}
      title={a.title[locale]}
      place={a.place[locale]}
      period={a.period[locale]}
      summary={summary ? undefined : a.summary[locale]}
      accent={i === 0}
    />
  ));

  // Arrow keys move between tabs (WAI-ARIA tabs pattern).
  const keys = (e: KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const next = tabs[(tabs.indexOf(tab) + 1) % tabs.length];
    setTab(next);
    tabRefs.current[tabs.indexOf(next)]?.focus();
  };

  return (
    <Section id="experience">
      <ModuleHeading id="experience" summary={summary} />

      {summary ? (
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h3 className="mb-6 text-sm font-medium text-primary-text">{t("work")}</h3>
            <ol>{workItems}</ol>
          </div>
          <div>
            <h3 className="mb-6 text-sm font-medium text-primary-text">{t("academic")}</h3>
            <ol>{academicItems}</ol>
          </div>
        </div>
      ) : (
        <>
          <div role="tablist" aria-label={t("tabs")} className="mb-12 inline-flex rounded-xl bg-primary-soft p-1">
            {tabs.map((id, i) => (
              <button
                key={id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                id={`tab-${id}`}
                role="tab"
                type="button"
                aria-selected={tab === id}
                aria-controls={`panel-${id}`}
                tabIndex={tab === id ? 0 : -1}
                onClick={() => setTab(id)}
                onKeyDown={keys}
                className={`h-11 cursor-pointer rounded-lg px-5 text-sm font-medium transition-colors ${
                  tab === id ? "bg-primary text-primary-foreground" : "text-primary-soft-ink hover:bg-primary/10"
                }`}
              >
                {t(id)}
              </button>
            ))}
          </div>

          <div id="panel-work" role="tabpanel" aria-labelledby="tab-work" hidden={tab !== "work"}>
            <ol>{workItems}</ol>
          </div>
          <div id="panel-academic" role="tabpanel" aria-labelledby="tab-academic" hidden={tab !== "academic"}>
            <ol>{academicItems}</ol>
            <h2 className="mt-16 text-2xl font-medium tracking-[-0.025em] text-ink md:text-3xl">{t("seminars")}</h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {seminars.map((s) => (
                <li key={s.id} className="flex flex-col gap-3 rounded-2xl bg-surface p-6">
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-primary-text">
                    <CalendarDays className="size-4" aria-hidden />
                    {s.date}
                  </span>
                  <span className="text-lg font-medium text-ink">{s.name[locale]}</span>
                  <span className="text-ink-soft">{s.topic[locale]}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </Section>
  );
}
