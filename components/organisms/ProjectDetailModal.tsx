"use client";

import { useEffect, useState, useCallback, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

const emptySubscribe = () => () => { };
function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}
import Image from "next/image";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  Check,
  Calendar,
  User,
  Watch,
} from "lucide-react";
import { Tag } from "@/components/atoms/Tag";
import { Icon } from "@/components/atoms/Icon";
import { AmbientParticles } from "@/components/molecules/AmbientParticles";
import type { Project } from "@/data/types";
import { useLocale } from "@/i18n/Providers";
import { useTranslations } from "next-intl";

export interface ProjectDetailModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectDetailModal({ project, isOpen, onClose }: ProjectDetailModalProps) {
  const t = useTranslations("projects");
  const locale = useLocale();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState<"left" | "right">("right");
  const mounted = useMounted();

  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  const gallery = project?.gallery?.filter(Boolean) ?? [];

  const handlePrev = useCallback(() => {
    if (gallery.length === 0) return;
    setSlideDirection("left");
    setCurrentSlide((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
  }, [gallery.length]);

  const handleNext = useCallback(() => {
    if (gallery.length === 0) return;
    setSlideDirection("right");
    setCurrentSlide((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
  }, [gallery.length]);

  // Handle keyboard shortcuts (Escape to close, arrows to cycle screenshots)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, handlePrev, handleNext]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !project || !mounted) return null;

  const title = project.title[locale] || project.title.es;
  const summary = project.summary[locale] || project.summary.es;
  const isSingleColumn = project.device === "desktop" || project.slug === "dj-ai";
  const isWatch = project.device === "smartwatch" || project.slug === "smartwatch-app";
  const emphasizedFrame = ["marketplace", "dj-ai", "sudo-kill-9", "smartwatch-app"].includes(project.slug);
  const frameStyle = emphasizedFrame
    ? "border-transparent shadow-[0_0_20px_rgba(0,0,0,0.14),0_8px_24px_-4px_rgba(0,0,0,0.24)] dark:shadow-[0_0_20px_rgba(255,255,255,0.16),0_8px_24px_-4px_rgba(255,255,255,0.22)]"
    : "border-primary/25 shadow-[0_0_12px_rgba(0,0,0,0.08),0_4px_14px_-2px_rgba(0,0,0,0.16)] dark:shadow-[0_0_12px_rgba(255,255,255,0.08),0_4px_14px_-2px_rgba(255,255,255,0.12)]";

  const actionButtons = (project.windowsUrl || project.linuxUrl || project.apkUrl || project.smartwatchUrl || project.demoUrl) && (
    <div className="mt-6 flex flex-wrap gap-3">
      {project.windowsUrl && (
        <a
          href={project.windowsUrl}
          download={project.windowsUrl !== "#" ? true : undefined}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            if (project.windowsUrl === "#") e.preventDefault();
          }}
          className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground dark:text-white shadow-[0_0_20px_rgba(220,38,38,0.35)] transition-all duration-200 hover:bg-primary-hover hover:shadow-[0_0_28px_rgba(220,38,38,0.5)] active:scale-[0.98]"
          title={project.windowsUrl === "#" ? (locale === "en" ? "Download link coming soon" : "Enlace de descarga disponible pronto") : undefined}
        >
          <Download className="size-4" />
          <Icon name="windows" className="size-4" />
          <span>{t("downloadWindows")}</span>
        </a>
      )}

      {project.linuxUrl && (
        <a
          href={project.linuxUrl}
          download={project.linuxUrl !== "#" ? true : undefined}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            if (project.linuxUrl === "#") e.preventDefault();
          }}
          className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground dark:text-white shadow-[0_0_20px_rgba(220,38,38,0.35)] transition-all duration-200 hover:bg-primary-hover hover:shadow-[0_0_28px_rgba(220,38,38,0.5)] active:scale-[0.98]"
          title={project.linuxUrl === "#" ? (locale === "en" ? "Download link coming soon" : "Enlace de descarga disponible pronto") : undefined}
        >
          <Download className="size-4" />
          <Icon name="linux" className="size-4" />
          <span>{t("downloadLinux")}</span>
        </a>
      )}

      {project.apkUrl && (
        <a
          href={project.apkUrl}
          download={project.apkUrl !== "#" ? true : undefined}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            if (project.apkUrl === "#") e.preventDefault();
          }}
          className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground dark:text-white shadow-[0_0_20px_rgba(220,38,38,0.35)] transition-all duration-200 hover:bg-primary-hover hover:shadow-[0_0_28px_rgba(220,38,38,0.5)] active:scale-[0.98]"
        >
          <Download className="size-4" />
          <span>{t("downloadApk")}</span>
        </a>
      )}

      {project.smartwatchUrl && (
        <a
          href={project.smartwatchUrl}
          download={project.smartwatchUrl !== "#" ? true : undefined}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            if (project.smartwatchUrl === "#") e.preventDefault();
          }}
          className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground dark:text-white shadow-[0_0_20px_rgba(220,38,38,0.35)] transition-all duration-200 hover:bg-primary-hover hover:shadow-[0_0_28px_rgba(220,38,38,0.5)] active:scale-[0.98]"
          title={project.smartwatchUrl === "#" ? (locale === "en" ? "Download link coming soon" : "Enlace de descarga disponible pronto") : undefined}
        >
          <Download className="size-4" />
          <Watch className="size-4" />
          <span>{t("downloadSmartwatch")}</span>
        </a>
      )}

      {project.demoUrl && (
        <a
          href={project.demoUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            if (project.demoUrl === "#") e.preventDefault();
          }}
          className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-primary/30 bg-surface px-5 text-sm font-semibold text-ink transition-all duration-200 hover:border-primary hover:bg-primary/10 hover:text-primary-text active:scale-[0.98]"
          title={project.demoUrl === "#" ? (locale === "en" ? "Web link coming soon" : "Enlace web disponible pronto") : undefined}
        >
          <ExternalLink className="size-4" />
          <span>{t("visitWeb")}</span>
        </a>
      )}
    </div>
  );

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
      onClick={handleBackdropClick}
      className="project-modal-backdrop-in fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto overscroll-contain bg-black/80 p-4 backdrop-blur-sm sm:p-6 md:p-8 scroll-smooth custom-scrollbar"
    >
      {/* Modal Dialog Card */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`project-modal-card-in isolate relative my-auto flex w-full max-w-5xl max-h-[85vh] sm:max-h-[88vh] flex-col overflow-hidden rounded-3xl border bg-surface/80 text-ink backdrop-blur-2xl dark:bg-surface/80 ${frameStyle}`}
      >
        <AmbientParticles contained />
        {/* Fixed Header with Title and Close Button */}
        <div className="relative z-10 flex shrink-0 items-center justify-between border-b border-ink/10 px-6 py-4 dark:border-white/10">
          <h2
            id="modal-project-title"
            className="font-display text-xl tracking-wide text-ink sm:text-2xl md:text-3xl"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("close")}
            className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-ink/15 bg-surface/80 text-ink transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Scrollable Body Content with Slim Scrollbar & Smooth Scrolling */}
        <div className="relative z-10 flex-1 min-h-0 overflow-y-auto overscroll-contain px-6 py-6 md:px-8 md:py-8 scroll-smooth custom-scrollbar">
          {isSingleColumn ? (
            /* Single Column Layout (DJ AI): Wide carousel on TOP, Full-width info on BOTTOM */
            <div className="flex flex-col gap-8 sm:gap-10">
              {/* Wide Monitor Carousel Section on TOP */}
              {gallery.length > 0 && (
                <div className="flex flex-col items-center">
                  <div className="relative flex w-full flex-col items-center">
                    <div className="relative flex w-full items-center justify-center gap-2 sm:gap-4 md:gap-6">
                      {gallery.length > 1 && (
                        <button
                          type="button"
                          onClick={handlePrev}
                          aria-label={t("previous")}
                          className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-ink/15 bg-surface/90 text-ink shadow-md backdrop-blur-sm transition-all hover:scale-110 hover:border-primary hover:bg-primary hover:text-primary-foreground active:scale-95 dark:border-white/15 dark:bg-surface/90"
                        >
                          <ChevronLeft className="size-5" />
                        </button>
                      )}

                      {/* Wide Desktop Monitor Mockup */}
                      <div className="relative flex w-full max-w-[340px] flex-col items-center sm:max-w-[560px] md:max-w-[680px] lg:max-w-[820px]">
                        {/* Monitor Screen Frame */}
                        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border-[5px] border-ink/25 bg-neutral-950 shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_30px_rgba(220,38,38,0.2)] sm:rounded-2xl sm:border-[8px] dark:border-white/20">
                          {/* Webcam dot at top bezel */}
                          <div className="absolute top-1 left-1/2 z-20 flex size-1.5 -translate-x-1/2 items-center justify-center rounded-full bg-neutral-900 ring-1 ring-white/20 sm:top-2 sm:size-2">
                            <span className="size-0.5 rounded-full bg-cyan-700/80 sm:size-1" />
                          </div>

                          {/* Screenshot image */}
                          <div className="relative size-full overflow-hidden bg-black">
                            <Image
                              key={gallery[currentSlide]}
                              src={gallery[currentSlide]}
                              alt={`${title} screenshot ${currentSlide + 1}`}
                              fill
                              className={`project-gallery-in project-gallery-in-${slideDirection} object-cover object-top`}
                              sizes="(min-width: 1024px) 820px, 95vw"
                              priority
                            />
                          </div>

                          {/* Bottom bezel subtle power LED */}
                          <div className="absolute bottom-1 right-2.5 z-20 size-1 rounded-full bg-primary/70 shadow-[0_0_4px_rgba(220,38,38,0.9)] sm:right-3.5 sm:size-1.5" />
                        </div>

                        {/* Monitor Stand Pillar / Neck */}
                        <div className="h-4 w-14 border-x border-ink/15 bg-gradient-to-b from-ink/30 via-ink/20 to-ink/35 sm:h-6 sm:w-20 dark:border-white/10 dark:from-white/25 dark:via-white/15 dark:to-white/30" />

                        {/* Monitor Stand Base */}
                        <div className="h-2.5 w-32 rounded-full bg-gradient-to-r from-ink/20 via-ink/40 to-ink/20 shadow-md sm:w-48 dark:from-white/15 dark:via-white/35 dark:to-white/15" />
                      </div>

                      {gallery.length > 1 && (
                        <button
                          type="button"
                          onClick={handleNext}
                          aria-label={t("next")}
                          className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-ink/15 bg-surface/90 text-ink shadow-md backdrop-blur-sm transition-all hover:scale-110 hover:border-primary hover:bg-primary hover:text-primary-foreground active:scale-95 dark:border-white/15 dark:bg-surface/90"
                        >
                          <ChevronRight className="size-5" />
                        </button>
                      )}
                    </div>

                    {/* Indicators */}
                    {gallery.length > 1 && (
                      <div className="mt-5 flex items-center justify-center gap-2">
                        {gallery.map((img, idx) => (
                          <button
                            key={img}
                            type="button"
                            onClick={() => {
                              setSlideDirection(idx > currentSlide ? "right" : "left");
                              setCurrentSlide(idx);
                            }}
                            aria-label={`${t("galleryAlt", { n: idx + 1, name: title })}`}
                            className={`cursor-pointer rounded-full transition-all duration-300 ${idx === currentSlide
                              ? "h-2.5 w-7 bg-primary shadow-[0_0_8px_rgba(220,38,38,0.7)]"
                              : "size-2.5 bg-ink/20 hover:bg-ink/40 dark:bg-white/20 dark:hover:bg-white/40"
                              }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Project Info Section on BOTTOM (Centered with constrained width) */}
              <div className="w-full border-t border-ink/10 pt-8 dark:border-white/10">
                <div className="mx-auto flex w-full max-w-2xl flex-col sm:max-w-3xl">
                  <p className="text-base leading-relaxed text-ink-soft sm:text-lg">
                    {summary}
                  </p>

                  {actionButtons}

                  {/* Description Paragraphs */}
                  {project.description && project.description.length > 0 && (
                    <div className="mt-6 space-y-3.5 text-sm leading-relaxed text-ink-soft sm:text-base">
                      {project.description.map((p, i) => (
                        <p key={i}>{p[locale] || p.es}</p>
                      ))}
                    </div>
                  )}

                  {/* Key Features */}
                  {project.features && project.features.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-lg font-display uppercase tracking-wider text-primary-text">
                        {t("features")}
                      </h3>
                      <ul className="mt-3.5 grid gap-2.5 sm:grid-cols-2 list-none p-0 m-0">
                        {project.features.map((f, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm text-ink sm:text-base">
                            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground dark:text-white">
                              <Check className="size-3" />
                            </span>
                            <span>{f[locale] || f.es}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Stack & Metadata */}
                  <div className="mt-8 border-t border-ink/10 pt-5 dark:border-white/10">
                    <div className="flex flex-wrap items-center gap-6 text-xs text-ink-faint sm:text-sm">
                      <span className="inline-flex items-center gap-1.5">
                        <User className="size-4 text-primary" />
                        <span>{project.role[locale] || project.role.es}</span>
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="size-4 text-primary" />
                        <span>{project.duration[locale] || project.duration.es}</span>
                      </span>
                    </div>

                    <ul className="mt-3 flex flex-wrap gap-2 list-none p-0 m-0" aria-label={t("stack")}>
                      {project.stack.map((s) => (
                        <Tag key={s}>{s}</Tag>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Two Column Grid Layout (e.g. Mobile & Smartwatch Apps) */
            <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
              {/* Gallery / Screenshot Carousel Section */}
              <div className="flex flex-col items-center lg:col-span-6 lg:justify-center">
                {isWatch || gallery.length > 0 ? (
                  <div className="relative flex w-full flex-col items-center">
                    {/* Device Mockup with Arrows positioned outside */}
                    <div className="relative flex w-full items-center justify-center gap-3 sm:gap-4 md:gap-6">
                      {/* Left arrow (outside device) */}
                      {gallery.length > 1 && (
                        <button
                          type="button"
                          onClick={handlePrev}
                          aria-label={t("previous")}
                          className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-ink/15 bg-surface/90 text-ink shadow-md backdrop-blur-sm transition-all hover:scale-110 hover:border-primary hover:bg-primary hover:text-primary-foreground active:scale-95 dark:border-white/15 dark:bg-surface/90"
                        >
                          <ChevronLeft className="size-5" />
                        </button>
                      )}

                      {isWatch ? (
                        /* Smartwatch Mockup Frame / Showcase */
                        <div className="relative flex shrink-0 flex-col items-center py-1 select-none">
                          {/* Top Strap */}
                          <div className="relative -mb-3 flex h-11 w-24 flex-col items-center justify-start gap-1.5 rounded-t-2xl border-x border-t border-ink/20 bg-gradient-to-b from-neutral-700 via-neutral-800 to-neutral-950 pt-2.5 shadow-inner sm:h-12 sm:w-28 dark:border-white/15">
                            <span className="h-0.5 w-14 rounded-full bg-white/10" />
                            <span className="h-0.5 w-14 rounded-full bg-white/10" />
                          </div>

                          {/* Watch Case + Side Crown & Button */}
                          <div className="relative z-10 flex items-center justify-center">
                            {/* Digital Crown */}
                            <div className="absolute -right-2.5 top-[31%] z-0 flex h-8 w-3 flex-col items-center justify-center rounded-r-md border border-white/15 bg-gradient-to-b from-neutral-500 via-neutral-700 to-neutral-900 shadow-md">
                              <span className="h-3.5 w-0.5 rounded-full bg-primary/90" />
                            </div>
                            {/* Secondary Side Button */}
                            <div className="absolute -right-2 top-[57%] z-0 h-5 w-2 rounded-r-sm border border-white/15 bg-gradient-to-b from-neutral-600 to-neutral-900 shadow-sm" />

                            {/* Metallic Outer Bezel */}
                            <div className="relative rounded-full bg-gradient-to-br from-neutral-600 via-neutral-900 to-neutral-950 p-2.5 ring-2 ring-ink/25 shadow-[0_18px_45px_rgba(0,0,0,0.55),0_0_28px_rgba(220,38,38,0.18)] sm:p-3.5 dark:ring-white/20">
                              {/* Inner Chamfer Ring */}
                              <div className="rounded-full border border-white/10 bg-neutral-950 p-1">
                                {/* Circular OLED Screen */}
                                <div className="relative aspect-square w-[210px] overflow-hidden rounded-full border-2 border-neutral-800 bg-black shadow-[inset_0_0_20px_rgba(0,0,0,0.9)] sm:w-[240px] md:w-[268px]">
                                  {/* Subtle Glass Reflection */}
                                  <div className="pointer-events-none absolute inset-0 z-20 rounded-full bg-gradient-to-br from-white/12 via-transparent to-transparent" />

                                  {gallery.length > 0 ? (
                                    <Image
                                      key={gallery[currentSlide]}
                                      src={gallery[currentSlide]}
                                      alt={`${title} screenshot ${currentSlide + 1}`}
                                      fill
                                      className={`project-gallery-in project-gallery-in-${slideDirection} object-cover object-center`}
                                      sizes="(min-width: 1024px) 270px, 70vw"
                                      priority
                                    />
                                  ) : (
                                    /* Standby Wear OS Placeholder before carousel images are added */
                                    <div className="relative flex size-full flex-col items-center justify-center bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.16)_0%,rgba(0,0,0,1)_72%)] px-6 text-center">
                                      <div className="pointer-events-none absolute size-[78%] rounded-full border border-primary/20" />
                                      <div className="pointer-events-none absolute size-[54%] rounded-full border border-dashed border-primary/30" />
                                      <Watch className="mb-2 size-8 text-primary drop-shadow-[0_0_10px_rgba(220,38,38,0.5)]" />
                                      <span className="font-display text-base tracking-wider text-white">
                                        {title}
                                      </span>
                                      <span className="mt-1 rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-[11px] font-medium text-white/70">
                                        {t("imagePending")}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Bottom Strap */}
                          <div className="relative -mt-3 flex h-11 w-24 flex-col items-center justify-end gap-1.5 rounded-b-2xl border-x border-b border-ink/20 bg-gradient-to-t from-neutral-700 via-neutral-800 to-neutral-950 pb-2.5 shadow-inner sm:h-12 sm:w-28 dark:border-white/15">
                            <span className="size-1.5 rounded-full bg-black/70 ring-1 ring-white/10" />
                            <span className="size-1.5 rounded-full bg-black/70 ring-1 ring-white/10" />
                          </div>
                        </div>
                      ) : (
                        /* Phone Mockup Frame / Showcase */
                        <div className="relative aspect-[9/18] w-full max-w-[240px] shrink-0 overflow-hidden rounded-[2.5rem] border-[6px] border-ink/20 bg-black shadow-[0_12px_36px_rgba(0,0,0,0.4),0_0_24px_rgba(220,38,38,0.15)] sm:max-w-[260px] md:max-w-[336px] dark:border-white/15">
                          {/* Speaker notch */}
                          <div className="absolute top-2 left-1/2 z-20 h-3.5 w-20 -translate-x-1/2 rounded-full bg-ink/40 dark:bg-white/20" />

                          {/* Screenshot image */}
                          <div className="relative size-full overflow-hidden bg-black">
                            <Image
                              key={gallery[currentSlide]}
                              src={gallery[currentSlide]}
                              alt={`${title} screenshot ${currentSlide + 1}`}
                              fill
                              className={`project-gallery-in project-gallery-in-${slideDirection} object-cover object-center`}
                              sizes="(min-width: 1024px) 340px, 80vw"
                              priority
                            />
                          </div>
                        </div>
                      )}

                      {/* Right arrow (outside device) */}
                      {gallery.length > 1 && (
                        <button
                          type="button"
                          onClick={handleNext}
                          aria-label={t("next")}
                          className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-ink/15 bg-surface/90 text-ink shadow-md backdrop-blur-sm transition-all hover:scale-110 hover:border-primary hover:bg-primary hover:text-primary-foreground active:scale-95 dark:border-white/15 dark:bg-surface/90"
                        >
                          <ChevronRight className="size-5" />
                        </button>
                      )}
                    </div>

                    {/* Indicators */}
                    {gallery.length > 1 && (
                      <div className="mt-4 flex items-center justify-center gap-2">
                        {gallery.map((img, idx) => (
                          <button
                            key={img}
                            type="button"
                            onClick={() => {
                              setSlideDirection(idx > currentSlide ? "right" : "left");
                              setCurrentSlide(idx);
                            }}
                            aria-label={`${t("galleryAlt", { n: idx + 1, name: title })}`}
                            className={`cursor-pointer rounded-full transition-all duration-300 ${idx === currentSlide
                              ? "h-2.5 w-7 bg-primary shadow-[0_0_8px_rgba(220,38,38,0.7)]"
                              : "size-2.5 bg-ink/20 hover:bg-ink/40 dark:bg-white/20 dark:hover:bg-white/40"
                              }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-primary-soft">
                    {project.cover && (
                      <Image src={project.cover} alt={title} fill className="object-cover" sizes="500px" />
                    )}
                  </div>
                )}
              </div>

              {/* Project Details Section */}
              <div className="flex flex-col lg:col-span-6">
                <p className="mt-6 space-y-3 text-sm leading-relaxed text-ink-soft sm:text-base">
                  {summary}
                </p>

                {actionButtons}

                {/* Description Paragraphs */}
                {project.description && project.description.length > 0 && (
                  <div className="mt-6 space-y-3 text-sm leading-relaxed text-ink-soft sm:text-base">
                    {project.description.map((p, i) => (
                      <p key={i}>{p[locale] || p.es}</p>
                    ))}
                  </div>
                )}

                {/* Key Features */}
                {project.features && project.features.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-display uppercase tracking-wider text-primary-text">
                      {t("features")}
                    </h3>
                    <ul className="mt-3 space-y-2 list-none p-0 m-0">
                      {project.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-ink sm:text-base">
                          <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground dark:text-white">
                            <Check className="size-3" />
                          </span>
                          <span>{f[locale] || f.es}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Stack & Metadata */}
                <div className="mt-6 border-t border-ink/10 pt-5 dark:border-white/10">
                  <div className="flex flex-wrap items-center gap-4 text-xs text-ink-faint sm:text-sm">
                    <span className="inline-flex items-center gap-1.5">
                      <User className="size-4 text-primary" />
                      <span>{project.role[locale] || project.role.es}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="size-4 text-primary" />
                      <span>{project.duration[locale] || project.duration.es}</span>
                    </span>
                  </div>

                  <ul className="mt-3 flex flex-wrap gap-2 list-none p-0 m-0" aria-label={t("stack")}>
                    {project.stack.map((s) => (
                      <Tag key={s}>{s}</Tag>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

export const ProjectModal = ProjectDetailModal;
