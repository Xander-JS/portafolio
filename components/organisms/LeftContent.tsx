"use client";

import { useTranslations } from "next-intl";
import { Icon } from "@/components/atoms/Icon";
import { profile } from "@/data/profile";
import { steps } from "@/data/steps";
import { useLocale } from "@/i18n/Providers";
import { useScrollStore } from "@/lib/useScrollStore";

/**
 * Left-anchored cinematic content over the 3D scene. Step 00 shows the name + title big; every later step fades to
 * that module's label, title, description and icon. `key={index}` replays the `panel-in` fade/scale, and the
 * text-shadow keeps it legible over the moving graph. Non-interactive, so scroll and the scene stay reachable.
 */
export function LeftContent() {
  const index = useScrollStore((s) => s.index);
  const locale = useLocale();
  const t = useTranslations("hero");
  const step = steps[index];
  const isHero = index === 0;

  return (
    <div className="pointer-events-none fixed inset-x-4 bottom-10 z-10 max-w-2xl md:inset-x-auto md:bottom-[14vh] md:left-[5.5vw]">
      <div key={index} className="panel-in [text-shadow:0_2px_28px_rgb(0_0_0/0.22)]">
        {isHero ? (
          <>
            <p className="text-sm font-medium text-primary-text md:text-base">{t("eyebrow")}</p>
            <h1 className="mt-2 text-balance text-5xl font-semibold tracking-[-0.04em] text-ink md:text-7xl lg:text-8xl">
              {profile.name}
            </h1>
            <p className="mt-4 max-w-xl text-balance text-lg text-ink-soft md:text-2xl">{t("tagline")}</p>
          </>
        ) : (
          <>
            <span className="inline-flex items-center gap-2 text-primary-text">
              <Icon name={step.icon} className="size-5" />
              <span className="text-sm font-medium tracking-wide">{step.label[locale]}</span>
            </span>
            <h2 className="mt-3 text-balance text-4xl font-semibold tracking-[-0.035em] text-ink md:text-6xl">
              {step.title[locale]}
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-soft md:text-xl">{step.description[locale]}</p>
          </>
        )}
      </div>
    </div>
  );
}
