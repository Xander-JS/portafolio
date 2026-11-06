"use client";

import { ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { Icon } from "@/components/atoms/Icon";
import { TypewriterHeading } from "@/components/atoms/TypewriterHeading";
import { moduleHref, modules } from "@/data/modules";
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
 * - Interactive explore CTA and keyboard shortcut (Enter) allow entering the active module.
 */
export function LeftContent() {
  const router = useRouter();
  const targetIndex = useScrollStore((s) => s.index);
  const setWarping = useScrollStore((s) => s.setWarping);
  const locale = useLocale();
  const t = useTranslations("hero");
  const tModules = useTranslations("modules");

  const [displayedIndex, setDisplayedIndex] = useState(targetIndex);
  const isTransitioning = targetIndex !== displayedIndex;

  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => {
        setDisplayedIndex(targetIndex);
      }, 220);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning, targetIndex]);

  const step = steps[displayedIndex];
  const isHero = displayedIndex === 0;
  const currentTitle = isHero ? profile.name : step.title[locale];

  const navigateToModule = useCallback(() => {
    if (displayedIndex === 0) return;
    const targetModule = modules[displayedIndex - 1];
    if (!targetModule) return;
    const href = moduleHref(targetModule);
    setWarping(true);
    setTimeout(() => {
      router.push(href);
    }, 280);
  }, [displayedIndex, router, setWarping]);

  // Global Enter shortcut when viewing any module section
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "Enter") return;
      const activeTag = document.activeElement?.tagName;
      if (activeTag === "INPUT" || activeTag === "TEXTAREA" || activeTag === "SELECT") return;
      if (displayedIndex > 0) {
        e.preventDefault();
        navigateToModule();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [displayedIndex, navigateToModule]);

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
              <TypewriterHeading key={currentTitle} text={currentTitle} speed={32} />
            </h1>
          ) : (
            <h2 className="text-balance font-display text-4xl tracking-wide text-ink md:text-6xl">
              <TypewriterHeading key={currentTitle} text={currentTitle} speed={32} />
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

        {/* Direct CTA button to enter the module */}
        {!isHero && (
          <div
            className={`mt-6 transition-all duration-300 ${
              isTransitioning ? "content-deconstruct" : "content-construct"
            }`}
          >
            <button
              type="button"
              onClick={navigateToModule}
              aria-label={`${tModules("explore")}: ${step.label[locale]}`}
              className="group/cta pointer-events-auto inline-flex cursor-pointer items-center gap-2.5 rounded-xl border border-primary/40 bg-surface/80 px-4 py-2.5 text-sm font-semibold tracking-wide text-ink backdrop-blur-md shadow-md transition-all duration-300 hover:border-primary hover:bg-primary hover:text-primary-foreground hover:shadow-[0_0_24px_rgba(240,67,89,0.35)] active:scale-95 md:px-5 md:py-3"
            >
              <span>{tModules("explore")}</span>
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" />
              <kbd className="ml-1.5 hidden rounded border border-ink/15 bg-ground/50 px-1.5 py-0.5 text-[10px] font-mono text-ink-faint transition-colors duration-300 group-hover/cta:border-primary-foreground/30 group-hover/cta:bg-primary-foreground/20 group-hover/cta:text-primary-foreground md:inline-block">
                ↵ Enter
              </kbd>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
