"use client";

import { useTranslations } from "next-intl";
import { SectionHeading } from "@/components/atoms/SectionHeading";
import { moduleById, moduleHref } from "@/data/modules";
import type { PortfolioModule } from "@/data/types";
import { useLocale } from "@/i18n/Providers";

/**
 * A section's heading, read from the shared module data: its label as title, its description as intro.
 * On the home page (`summary`) it is an h2 with "View more"; on the detail page it is the h1.
 */
export function ModuleHeading({ id, summary, intro = true }: { id: PortfolioModule["id"]; summary: boolean; intro?: boolean }) {
  const tc = useTranslations("common");
  const locale = useLocale();
  const m = moduleById(id);
  const label = m.label[locale];
  return (
    <SectionHeading
      id={`${id}-title`}
      title={label}
      intro={intro ? m.description[locale] : undefined}
      level={summary ? 2 : 1}
      more={summary ? { href: moduleHref(m), label: tc("viewMore"), srLabel: tc("viewMoreAbout", { section: label }) } : undefined}
    />
  );
}
