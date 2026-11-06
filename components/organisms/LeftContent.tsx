"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/atoms/Icon";
import { TypewriterHeading } from "@/components/atoms/TypewriterHeading";
import { profile } from "@/data/profile";
import { steps } from "@/data/steps";
import { useLocale } from "@/i18n/Providers";
import { useScrollStore } from "@/lib/useScrollStore";

/**
 * Left-anchored cinematic content over the 3D scene.
 *
 * - The primary title writes itself progressively with a blinking cursor ('|').
 * - Accompanying eyebrow, icon, and description animate with a digital construction (blur-in + slide-up)
 *   and deconstruction phase during section transitions, preventing abrupt visual cuts.
 */
export function LeftContent() {
  const targetIndex = useScrollStore((s) => s.index);
  const locale = useLocale();
  const t = useTranslations("hero");

  // Track active displayed index and transition state
  const [displayedIndex, setDisplayedIndex] = useState(targetIndex);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (targetIndex !== displayedIndex) {
      setIsTransitioning(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      // Brief deconstruction out-phase before mounting the new content
      timeoutRef.current = setTimeout(() => {
        setDisplayedIndex(targetIndex);
        setIsTransitioning(false);
      }, 220);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [targetIndex, displayedIndex]);

  const step = steps[displayedIndex];
  const isHero = displayedIndex === 0;
  const currentTitle = isHero ? profile.name : step.title[locale];

  return (
    <div className="pointer-events-none fixed inset-x-4 bottom-10 z-10 max-w-2xl md:inset-x-auto md:bottom-[14vh] md:left-[5.5vw]">
      <div className="[text-shadow:0_2px_28px_rgb(0_0_0/0.22)]">
        {/* Eyebrow & Icon header with construction / deconstruction */}
        <div
          className={`transition-all duration-300 ${
            isTransitioning ? "content-deconstruct" : "content-construct"
          }`}
        >
          {isHero ? (
            <p className="text-sm font-medium text-primary-text md:text-base">
              {t("eyebrow")}
            </p>
          ) : (
            <span className="inline-flex items-center gap-2 text-primary-text">
              <Icon name={step.icon} className="size-5" />
              <span className="text-sm font-medium tracking-wide">
                {step.label[locale]}
              </span>
            </span>
          )}
        </div>

        {/* Primary Title with dynamic typewriter effect and cursor */}
        <div className="mt-2.5">
          {isHero ? (
            <h1 className="text-balance font-display text-5xl tracking-wide text-ink md:text-7xl lg:text-8xl">
              <TypewriterHeading text={currentTitle} speed={32} />
            </h1>
          ) : (
            <h2 className="text-balance font-display text-4xl tracking-wide text-ink md:text-6xl">
              <TypewriterHeading text={currentTitle} speed={32} />
            </h2>
          )}
        </div>

        {/* Descriptive body with construction / deconstruction blur effect */}
        <div
          className={`mt-4 transition-all duration-300 ${
            isTransitioning ? "content-deconstruct" : "content-construct"
          }`}
        >
          {isHero ? (
            <p className="max-w-xl text-balance text-lg text-ink-soft md:text-2xl">
              {t("tagline")}
            </p>
          ) : (
            <p className="max-w-xl text-lg leading-relaxed text-ink-soft md:text-xl">
              {step.description[locale]}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
