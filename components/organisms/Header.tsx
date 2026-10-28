"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { LanguageToggle } from "@/components/molecules/LanguageToggle";
import { ThemeToggle } from "@/components/molecules/ThemeToggle";
import { moduleHref, modules } from "@/data/modules";
import { profile } from "@/data/profile";
import { useLocale } from "@/i18n/Providers";

/** The nav bar that stays with you as you scroll. Each link opens that section's own page. */
export function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const locale = useLocale();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-ground px-4 pt-3 pb-1 md:px-[5.5vw] md:pt-4">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground">
        {t("skip")}
      </a>
      <div className="flex h-14 items-center gap-2 rounded-2xl bg-surface px-3 md:h-16 md:gap-4 md:px-5">
        <Link href="/" className="flex min-w-0 items-center gap-2.5 font-medium tracking-[-0.02em] text-ink">
          <span aria-hidden className="size-3.5 shrink-0 rounded-[3px] bg-primary" />
          <span className="truncate">{profile.name}</span>
        </Link>

        <nav aria-label={t("menu")} className="ml-auto">
          <button
            type="button"
            className="inline-flex size-11 cursor-pointer items-center justify-center rounded-md text-ink xl:hidden"
            aria-expanded={open}
            aria-controls="nav-links"
            aria-label={t("menu")}
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </button>
          <ul
            id="nav-links"
            className={`${open ? "flex" : "hidden"} absolute inset-x-4 top-[4.75rem] flex-col rounded-2xl bg-surface p-2 shadow-[0_12px_32px_rgb(0_0_0/0.14)] md:inset-x-[5.5vw] xl:static xl:flex xl:flex-row xl:bg-transparent xl:p-0 xl:shadow-none`}
          >
            {modules.map((m) => {
              const href = moduleHref(m);
              const current = pathname === href || pathname.startsWith(`${href}/`);
              return (
                <li key={m.id}>
                  <Link
                    href={href}
                    onClick={() => setOpen(false)}
                    aria-current={current ? "page" : undefined}
                    className={`flex h-11 items-center rounded-md px-3 text-sm transition-colors ${
                      current ? "bg-primary-soft font-medium text-primary-soft-ink" : "text-ink-soft hover:text-primary-text"
                    }`}
                  >
                    {m.label[locale]}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
