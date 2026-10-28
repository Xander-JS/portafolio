"use client";

import { useTranslations } from "next-intl";
import { SocialLinks } from "@/components/molecules/SocialLinks";
import { profile } from "@/data/profile";

export function Footer({ year }: { year: number }) {
  const t = useTranslations("footer");
  return (
    <footer className="px-4 pb-8 md:px-[5.5vw]">
      <p aria-hidden className="text-[clamp(2.5rem,9vw,9rem)] leading-none font-medium tracking-[-0.04em] text-primary/20">
        {profile.name}
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 text-sm text-ink-faint">
        <p>
          © {year} {profile.name}. {t("rights")}
        </p>
        <SocialLinks withEmail className="-mr-3" />
      </div>
    </footer>
  );
}
