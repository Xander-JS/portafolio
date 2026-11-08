"use client";

import { ArrowUpRight, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { Icon } from "@/components/atoms/Icon";
import { TypewriterHeading } from "@/components/atoms/TypewriterHeading";
import { profile } from "@/data/profile";
import { cvUrl } from "@/data/site";
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

  const safeIndex = Math.max(0, Math.min(steps.length - 1, Number.isFinite(displayedIndex) ? displayedIndex : 0));
  const step = steps[safeIndex] || steps[0];
  const isHero = safeIndex === 0;
  const isContact = safeIndex === steps.length - 1;
  const hasModule = Boolean(step.href);
  const currentTitle = isHero ? profile.name : step.title[locale];

  const navigateToModule = useCallback(() => {
    if (!step.href) return;
    const href = step.href;
    setWarping(true);
    setTimeout(() => {
      router.push(href);
    }, 280);
  }, [step.href, router, setWarping]);

  // Global Enter shortcut when viewing any module section with a dedicated window
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "Enter") return;
      const activeTag = document.activeElement?.tagName;
      if (activeTag === "INPUT" || activeTag === "TEXTAREA" || activeTag === "SELECT") return;
      if (hasModule) {
        e.preventDefault();
        navigateToModule();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [hasModule, navigateToModule]);

  return (
    <div
      className={`pointer-events-none fixed inset-x-4 z-10 max-w-2xl transition-[bottom,transform] duration-500 ease-out md:inset-x-auto md:left-[5.5vw] ${isContact
        ? "bottom-[240px] sm:bottom-[220px] md:bottom-[34vh] lg:bottom-[38vh]"
        : "bottom-10 md:bottom-[14vh]"
        }`}
    >
      <div className="[text-shadow:0_2px_28px_rgb(0_0_0/0.22)]">
        {/* Eyebrow & Icon header with construction / deconstruction */}
        <div
          className={`transition-all duration-300 ${isTransitioning ? "content-deconstruct" : "content-construct"
            }`}
        >
          {isHero ? (
            <p className="text-sm font-medium text-primary-text md:text-base">
              {t("eyebrow")}
            </p>
          ) : isContact ? (
            <a
              href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
                profile.email || "alecxandermarlon@gmail.com",
              )}&su=${encodeURIComponent(
                locale === "en" ? "Contact from Portfolio" : "Contacto desde Portafolio",
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group pointer-events-auto inline-flex cursor-pointer items-center gap-2.5 rounded-full border border-primary/30 bg-surface/85 px-4 py-1.5 text-sm font-medium tracking-wide text-primary-text backdrop-blur-md shadow-xs transition-all duration-300 hover:border-primary hover:bg-primary/10 hover:shadow-[0_0_18px_rgba(240,67,89,0.35)] active:scale-95"
            >
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-primary" />
              </span>
              <Icon name="mail" className="size-4" />
              <span>
                {locale === "en" ? "Send direct message" : "Escribir mensaje directo"}
              </span>
              <ArrowUpRight className="size-3.5 opacity-70 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
            </a>
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
          className={`mt-4 transition-all duration-300 ${isTransitioning ? "content-deconstruct" : "content-construct"
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
        {hasModule && (
          <div
            className={`mt-6 transition-all duration-300 ${isTransitioning ? "content-deconstruct" : "content-construct"
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

        {/* Action button on Hero to download CV */}
        {isHero && cvUrl && (
          <div
            className={`mt-6 transition-all duration-300 ${isTransitioning ? "content-deconstruct" : "content-construct"
              }`}
          >
            <a
              href={cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("downloadCv")}
              className="group/cta pointer-events-auto inline-flex cursor-pointer items-center gap-2.5 rounded-xl border border-primary/40 bg-surface/80 px-4 py-2.5 text-sm font-semibold tracking-wide text-ink backdrop-blur-md shadow-md transition-all duration-300 hover:border-primary hover:bg-primary hover:text-primary-foreground hover:shadow-[0_0_24px_rgba(240,67,89,0.35)] active:scale-95 md:px-5 md:py-3"
            >
              <span>{t("downloadCv")}</span>
              <Download className="size-4 transition-transform duration-300 group-hover/cta:translate-y-0.5" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
