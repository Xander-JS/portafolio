"use client";

import { useTranslations } from "next-intl";
import { Glass } from "@/components/atoms/Glass";
import type { Experience } from "@/data/types";

export function ExperienceItem({ item }: { item: Experience }) {
  const t = useTranslations("experience");
  return (
    <li className="grid gap-4 py-10 md:grid-cols-[1fr_2fr] md:gap-12">
      <div>
        <h3 className="text-3xl font-medium tracking-[-0.03em] text-ink">{t(`items.${item.id}.role`)}</h3>
        <p className="mt-2 text-sm text-ink-faint">
          {item.place} · {item.period}
        </p>
      </div>
      <div>
        <p className="max-w-[60ch] text-lg leading-relaxed text-ink">{t(`items.${item.id}.summary`)}</p>
        <p className="mt-6 text-sm text-ink-faint">{t("skillsLabel")}</p>
        <ul className="mt-2 flex flex-wrap gap-2">
          {item.skills.map((s) => (
            <Glass as="li" key={s} className="rounded-lg px-3 py-1.5 text-sm font-medium text-ink">
              {t(`skills.${s}`)}
            </Glass>
          ))}
        </ul>
      </div>
    </li>
  );
}
