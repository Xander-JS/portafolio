"use client";

import { useState } from "react";
import { ArrowRight, Download, ExternalLink, Watch } from "lucide-react";
import { useTranslations } from "next-intl";
import { ProjectImage } from "@/components/atoms/ProjectImage";
import { Tag } from "@/components/atoms/Tag";
import { Icon } from "@/components/atoms/Icon";
import type { Project } from "@/data/types";
import { useLocale } from "@/i18n/Providers";
import { ProjectDetailModal } from "@/components/organisms/ProjectDetailModal";

export function ProjectCard({
  project,
  featured = false,
  imagePosition = "left",
}: {
  project: Project;
  featured?: boolean;
  imagePosition?: "left" | "right";
}) {
  const t = useTranslations("projects");
  const locale = useLocale();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const title = project.title[locale] || project.title.es;
  const summary = project.summary[locale] || project.summary.es;
  const isImageRight = featured && imagePosition === "right";
  const featuredGridClass = featured
    ? isImageRight
      ? "md:col-span-2 md:grid md:grid-cols-[1fr_1.3fr]"
      : "md:col-span-2 md:grid md:grid-cols-[1.3fr_1fr]"
    : "";

  return (
    <>
      <article
        className={`group relative flex flex-col overflow-hidden rounded-2xl border border-black/15 bg-surface/25 shadow-[0_0_12px_rgba(0,0,0,0.08),0_4px_14px_-2px_rgba(0,0,0,0.16)] backdrop-blur-md transition-all duration-300 ease-out hover:-translate-y-1 hover:border-black/25 hover:shadow-[0_0_16px_rgba(0,0,0,0.12),0_6px_18px_-2px_rgba(0,0,0,0.22)] dark:border-white/15 dark:shadow-[0_0_12px_rgba(255,255,255,0.08),0_4px_14px_-2px_rgba(255,255,255,0.12)] dark:hover:border-white/25 dark:hover:shadow-[0_0_16px_rgba(255,255,255,0.12),0_6px_18px_-2px_rgba(255,255,255,0.18)] ${featuredGridClass}`}
      >
        {/* Clickable cover to open detail modal */}
        <div
          onClick={() => setIsModalOpen(true)}
          className={`relative m-2 cursor-pointer overflow-hidden rounded-xl ${featured ? "aspect-[16/10] md:aspect-auto md:min-h-80" : "aspect-[16/10]"
            } ${isImageRight ? "md:order-2" : ""}`}
        >
          <ProjectImage
            src={project.cover}
            alt={t("imageAlt", { name: title })}
            label={title}
            note={t("imagePending")}
            sizes="(min-width: 768px) 50vw, 100vw"
          />
          <div className="absolute inset-0 bg-primary/0 transition-colors duration-300 group-hover:bg-primary/10" />
        </div>

        <div className={`flex flex-1 flex-col p-6 md:p-8 ${isImageRight ? "md:order-1" : ""}`}>
          <h3
            onClick={() => setIsModalOpen(true)}
            className={`cursor-pointer font-display tracking-wide text-ink transition-colors hover:text-primary-text ${featured ? "text-3xl md:text-4xl" : "text-2xl"
              }`}
          >
            {title}
          </h3>

          <p className="mt-3 text-base leading-relaxed text-ink-soft">{summary}</p>

          <ul className="mt-5 flex flex-wrap gap-2 list-none p-0 m-0" aria-label={t("stack")}>
            {project.stack.map((s) => (
              <Tag key={s}>{s}</Tag>
            ))}
          </ul>

          {/* Action buttons: Download APK, Download Windows, Download Linux, Download Smartwatch, Visit Web */}
          {(project.apkUrl || project.windowsUrl || project.linuxUrl || project.smartwatchUrl || project.demoUrl) && (
            <div className="mt-6 flex flex-wrap items-center gap-2.5">
              {project.windowsUrl && (
                <a
                  href={project.windowsUrl}
                  download={project.windowsUrl !== "#" ? true : undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (project.windowsUrl === "#") e.preventDefault();
                  }}
                  className="inline-flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-primary px-3.5 text-xs font-semibold text-primary-foreground dark:text-white shadow-sm transition-all hover:bg-primary-hover active:scale-[0.98]"
                  title={project.windowsUrl === "#" ? (locale === "en" ? "Download link coming soon" : "Enlace de descarga disponible pronto") : undefined}
                >
                  <Download className="size-3.5" />
                  <Icon name="windows" className="size-3.5" />
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
                    e.stopPropagation();
                    if (project.linuxUrl === "#") e.preventDefault();
                  }}
                  className="inline-flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-primary px-3.5 text-xs font-semibold text-primary-foreground dark:text-white shadow-sm transition-all hover:bg-primary-hover active:scale-[0.98]"
                  title={project.linuxUrl === "#" ? (locale === "en" ? "Download link coming soon" : "Enlace de descarga disponible pronto") : undefined}
                >
                  <Download className="size-3.5" />
                  <Icon name="linux" className="size-3.5" />
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
                    e.stopPropagation();
                    if (project.apkUrl === "#") e.preventDefault();
                  }}
                  className="inline-flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-primary px-3.5 text-xs font-semibold text-primary-foreground dark:text-white shadow-sm transition-all hover:bg-primary-hover active:scale-[0.98]"
                >
                  <Download className="size-3.5" />
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
                    e.stopPropagation();
                    if (project.smartwatchUrl === "#") e.preventDefault();
                  }}
                  className="inline-flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-primary px-3.5 text-xs font-semibold text-primary-foreground dark:text-white shadow-sm transition-all hover:bg-primary-hover active:scale-[0.98]"
                  title={project.smartwatchUrl === "#" ? (locale === "en" ? "Download link coming soon" : "Enlace de descarga disponible pronto") : undefined}
                >
                  <Download className="size-3.5" />
                  <Watch className="size-3.5" />
                  <span>{t("downloadSmartwatch")}</span>
                </a>
              )}
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (project.demoUrl === "#") e.preventDefault();
                  }}
                  className="inline-flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-ink/15 bg-surface px-3.5 text-xs font-semibold text-ink transition-all hover:border-primary hover:bg-primary/10 hover:text-primary-text active:scale-[0.98]"
                  title={project.demoUrl === "#" ? (locale === "en" ? "Web link coming soon" : "Enlace web disponible pronto") : undefined}
                >
                  <ExternalLink className="size-3.5" />
                  <span>{t("visitWeb")}</span>
                </a>
              )}
            </div>
          )}

          {/* View details button / action */}
          <div className="mt-auto flex items-center justify-between gap-4 pt-6 text-sm">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="group/btn inline-flex cursor-pointer items-center gap-1.5 font-medium text-primary-text transition-colors hover:text-primary-hover"
            >
              <span>{t("details")}</span>
              <ArrowRight className="size-4 transition-transform group-hover/btn:translate-x-1" aria-hidden />
            </button>
          </div>
        </div>
      </article>

      {/* Detail Modal / Dialog */}
      <ProjectDetailModal
        project={project}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
