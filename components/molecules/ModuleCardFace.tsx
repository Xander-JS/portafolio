"use client";

import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import type { Ref } from "react";
import { Icon } from "@/components/atoms/Icon";
import type { PortfolioModule } from "@/data/types";
import { useLocale } from "@/i18n/Providers";

type Props = {
  module: PortfolioModule;
  side: "front" | "back";
  /** Staggers the background drift so neighbouring cards don't move in step. */
  index: number;
  id?: string;
  linkRef?: Ref<HTMLAnchorElement>;
  className?: string;
};

/** One face of a module card: front is tag, icon, title, one line; back is quick facts and "View more". */
export function ModuleCardFace({ module, side, index, id, linkRef, className = "" }: Props) {
  const t = useTranslations();
  const locale = useLocale();
  const title = module.title[locale];

  return (
    <div id={id} className={`relative flex flex-col overflow-hidden rounded-2xl text-white ring-1 ring-white/10 ring-inset ${className}`}>
      <div aria-hidden className="module-bg" style={{ animationDelay: `${index * -2.7}s` }} />
      {side === "back" && <div aria-hidden className="absolute inset-0 bg-primary-950/55" />}
      {/* The intersecting circles from the reference, in the red scale. */}
      <div aria-hidden className={`absolute right-6 flex -space-x-3.5 ${side === "front" ? "top-[44%]" : "top-6"}`}>
        <span className="size-8 rounded-full border border-white/15 bg-primary-300/30" />
        <span className="size-8 rounded-full border border-white/15 bg-primary-200/45" />
      </div>

      {side === "front" ? (
        <div className="relative flex h-full flex-col p-6">
          <div className="flex items-start justify-between gap-4">
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium">{t(`nav.${module.id}`)}</span>
            <span className="grid size-12 place-items-center rounded-2xl bg-white text-primary-700">
              <Icon name={module.icon} className="size-6" />
            </span>
          </div>
          <div className="mt-auto max-w-[85%]">
            <h3 className="text-[1.75rem] leading-[1.1] font-medium tracking-[-0.025em] text-balance">{title}</h3>
            <p className="mt-2 text-[15px] leading-snug">{module.description[locale]}</p>
          </div>
        </div>
      ) : (
        <div className="relative flex h-full flex-col p-6">
          <p className="text-xs font-medium">{t(`nav.${module.id}`)}</p>
          <p className="mt-2 max-w-[75%] text-xl leading-tight font-medium tracking-[-0.02em]">{title}</p>
          <ul className="mt-6 space-y-3">
            {module.facts.map((f) => (
              <li key={f.en} className="flex items-start gap-2.5 text-[15px] leading-snug">
                <Check className="mt-0.5 size-4 shrink-0 text-primary-200" aria-hidden />
                {f[locale]}
              </li>
            ))}
          </ul>
          <Link
            ref={linkRef}
            href={module.href}
            aria-label={t("common.viewMoreAbout", { section: title })}
            className="group mt-auto inline-flex h-11 items-center justify-center gap-2 rounded-md bg-white px-5 text-sm font-medium text-primary-700 transition-colors hover:bg-primary-50"
          >
            {t("common.viewMore")}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </div>
      )}
    </div>
  );
}
