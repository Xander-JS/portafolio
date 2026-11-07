"use client";

import { useTranslations } from "next-intl";
import { SocialLinks } from "@/components/molecules/SocialLinks";
import { profile } from "@/data/profile";

export function Footer({
  year,
  showBranding = true,
}: {
  year: number;
  showBranding?: boolean;
}) {
  const t = useTranslations("footer");
  return (
    <footer className="relative z-10 px-8 pb-8 md:px-[5.5vw]">
      {showBranding && (
        <p
          aria-hidden
          className="font-display text-[clamp(2.5rem,8vw,8rem)] leading-none tracking-wide text-primary/80 select-none"
        >
          {profile.name}
        </p>
      )}
      <div
        className={`flex flex-wrap items-center gap-4 text-sm text-ink-faint ${showBranding ? "mt-6 justify-between" : "justify-end"
          }`}
      >
        {showBranding && (
          <p>
            © {year} {profile.name}. {t("rights")}
          </p>
        )}
        <SocialLinks className="-mr-3" />
      </div>
    </footer>
  );
}
