"use client";

import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Glass } from "@/components/atoms/Glass";
import { LanguageToggle } from "@/components/molecules/LanguageToggle";
import { ThemeToggle } from "@/components/molecules/ThemeToggle";
import { profile } from "@/data/profile";

const links = ["about", "skills", "projects", "experience", "contact"] as const;

/** The nav slab that sits above the hero panel and stays with you as you scroll. */
export function Header() {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 px-4 pt-3 md:px-[5.5vw] md:pt-4">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded-md focus:bg-pill focus:px-4 focus:py-2 focus:text-pill-ink">
        {t("skip")}
      </a>
      <Glass className="flex h-14 items-center gap-2 rounded-2xl px-3 md:h-16 md:gap-4 md:px-5">
        <a href="#top" className="flex min-w-0 items-center gap-2.5 font-medium tracking-[-0.02em] text-ink">
          <span aria-hidden className="size-3.5 shrink-0 rounded-[3px] bg-ink" />
          <span className="truncate">{profile.name}</span>
        </a>

        <nav aria-label={t("menu")} className="ml-auto">
          <button
            type="button"
            className="inline-flex size-11 cursor-pointer items-center justify-center rounded-md text-ink md:hidden"
            aria-expanded={open}
            aria-controls="nav-links"
            aria-label={t("menu")}
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </button>
          <ul
            id="nav-links"
            className={`${open ? "flex" : "hidden"} glass absolute inset-x-0 top-[4.25rem] flex-col p-2 md:static md:flex md:flex-row md:bg-transparent md:p-0 md:shadow-none md:before:hidden`}
          >
            {links.map((id) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={() => setOpen(false)}
                  className="flex h-11 items-center rounded-md px-3 text-sm text-ink-soft transition-colors hover:text-ink"
                >
                  {t(id)}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </Glass>
    </header>
  );
}
