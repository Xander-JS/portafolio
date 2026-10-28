"use client";

import { ArrowRight, Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { ButtonNavLink } from "@/components/atoms/Button";
import { moduleHref } from "@/data/modules";
import type { Localized, PortfolioModule } from "@/data/types";

/** The words of a module card: tag, large title, description, quick facts and "Go". */
export function ModulePanel({ module, locale }: { module: PortfolioModule; locale: keyof Localized }) {
  const t = useTranslations("modules");
  const label = module.label[locale];
  return (
    <div>
      <span className="inline-flex h-7 items-center rounded-full bg-primary-soft px-3 text-xs font-medium text-primary-soft-ink">{label}</span>
      <h3 className="mt-3 text-3xl leading-[1.02] font-medium tracking-[-0.035em] text-balance text-ink lg:mt-5 lg:text-[clamp(2.75rem,4.6vw,4.75rem)]">
        {module.title[locale]}
      </h3>
      <p className="mt-3 max-w-[52ch] text-base leading-relaxed text-ink-soft max-lg:line-clamp-3 lg:mt-6 lg:text-xl">{module.description[locale]}</p>
      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 lg:mt-8 lg:flex-col lg:gap-3">
        {module.facts.map((f) => (
          <li key={f.en} className="flex items-center gap-2.5 text-sm text-ink lg:text-lg">
            <span className="grid size-5 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground lg:size-6">
              <Check className="size-3 lg:size-3.5" aria-hidden />
            </span>
            {f[locale]}
          </li>
        ))}
      </ul>
      <ButtonNavLink variant="primary" href={moduleHref(module)} aria-label={`${t("go")}: ${label}`} className="group mt-5 h-12 px-7 text-base lg:mt-10">
        {t("go")}
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
      </ButtonNavLink>
    </div>
  );
}
