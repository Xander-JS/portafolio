"use client";

import { useTranslations } from "next-intl";
import { setLocale, useLocale } from "@/i18n/Providers";

export function LanguageToggle() {
  const locale = useLocale();
  const t = useTranslations("nav");
  return (
    <button
      type="button"
      onClick={() => setLocale(locale === "es" ? "en" : "es")}
      aria-label={t("language")}
      className="inline-flex h-11 cursor-pointer items-center gap-1 rounded-md px-2.5 text-sm font-medium text-ink-faint transition-colors hover:text-ink"
    >
      <span className={locale === "es" ? "text-ink" : ""}>ES</span>
      <span aria-hidden>/</span>
      <span className={locale === "en" ? "text-ink" : ""}>EN</span>
    </button>
  );
}
