"use client";

import { ArrowUpRight, Check, Download, Watch } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/atoms/Badge";
import { ButtonLink } from "@/components/atoms/Button";
import { ProjectImage } from "@/components/atoms/ProjectImage";
import { Section } from "@/components/atoms/Section";
import { Tag } from "@/components/atoms/Tag";
import { Icon } from "@/components/atoms/Icon";
import type { Project } from "@/data/types";
import { useLocale } from "@/i18n/Providers";

/** Everything about one project: cover, facts, description, features, gallery and its links (hidden when empty). */
export function ProjectDetail({ project }: { project: Project }) {
  const t = useTranslations("projects");
  const locale = useLocale();
  const title = project.title[locale];
  const facts = [
    [t("role"), project.role[locale]],
    [t("duration"), project.duration[locale]],
  ];

  return (
    <Section id="project">
      <Link href="/projects" className="inline-flex h-11 items-center font-sans text-sm font-medium text-primary-text underline decoration-transparent underline-offset-4 hover:decoration-current">
        {t("back")}
      </Link>

      <div className="mt-6 flex flex-wrap gap-2">
        <Badge tone="solid">{t(`type.${project.type}`)}</Badge>
        <Badge>{t(`status.${project.status}`)}</Badge>
      </div>
      <h1 id="project-title" className="mt-5 max-w-4xl font-display text-4xl tracking-wide text-balance text-ink md:text-6xl">
        {title}
      </h1>
      <p className="mt-5 max-w-2xl text-xl leading-relaxed text-ink-soft">{project.summary[locale]}</p>

      <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-2xl md:aspect-[21/9]">
        <ProjectImage src={project.cover} alt={t("imageAlt", { name: title })} label={title} note={t("imagePending")} sizes="100vw" />
      </div>

      <div className="mt-14 grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-20">
        <div className="space-y-5">
          {project.description.map((p) => (
            <p key={p.en} className="max-w-[65ch] text-lg leading-relaxed text-ink">
              {p[locale]}
            </p>
          ))}
          <h2 className="pt-6 text-2xl font-medium tracking-[-0.025em] text-ink">{t("features")}</h2>
          <ul className="space-y-3 list-none p-0 m-0">
            {project.features.map((f) => (
              <li key={f.en} className="flex items-start gap-3 text-lg text-ink">
                <span className="mt-1 grid size-6 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground dark:text-white">
                  <Check className="size-3.5" aria-hidden />
                </span>
                <span>{f[locale]}</span>
              </li>
            ))}
          </ul>
        </div>

        <aside className="self-start rounded-2xl bg-primary-soft p-7">
          <dl className="grid gap-6">
            {facts.map(([term, value]) => (
              <div key={term}>
                <dt className="text-sm text-primary-soft-ink">{term}</dt>
                <dd className="mt-1 text-xl font-medium text-ink">{value}</dd>
              </div>
            ))}
            <div>
              <dt className="text-sm text-primary-soft-ink">{t("stack")}</dt>
              <dd className="mt-2">
                <ul className="flex flex-wrap gap-2 list-none p-0 m-0">
                  {project.stack.map((s) => (
                    <Tag key={s}>{s}</Tag>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
          {(project.demoUrl || project.repoUrl || project.apkUrl || project.windowsUrl || project.linuxUrl || project.smartwatchUrl) && (
            <div className="mt-7 flex flex-wrap gap-3">
              {project.windowsUrl && (
                <ButtonLink
                  variant="primary"
                  className="dark:text-white"
                  href={project.windowsUrl}
                  download={project.windowsUrl !== "#" ? true : undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    if (project.windowsUrl === "#") e.preventDefault();
                  }}
                  title={project.windowsUrl === "#" ? (locale === "en" ? "Download link coming soon" : "Enlace de descarga disponible pronto") : undefined}
                >
                  <Download className="size-4" aria-hidden />
                  <Icon name="windows" className="size-4" />
                  {t("downloadWindows")}
                </ButtonLink>
              )}
              {project.linuxUrl && (
                <ButtonLink
                  variant="primary"
                  className="dark:text-white"
                  href={project.linuxUrl}
                  download={project.linuxUrl !== "#" ? true : undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    if (project.linuxUrl === "#") e.preventDefault();
                  }}
                  title={project.linuxUrl === "#" ? (locale === "en" ? "Download link coming soon" : "Enlace de descarga disponible pronto") : undefined}
                >
                  <Download className="size-4" aria-hidden />
                  <Icon name="linux" className="size-4" />
                  {t("downloadLinux")}
                </ButtonLink>
              )}
              {project.apkUrl && (
                <ButtonLink
                  variant="primary"
                  className="dark:text-white"
                  href={project.apkUrl}
                  download={project.apkUrl !== "#" ? true : undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    if (project.apkUrl === "#") e.preventDefault();
                  }}
                >
                  <Download className="size-4" aria-hidden /> {t("downloadApk")}
                </ButtonLink>
              )}
              {project.smartwatchUrl && (
                <ButtonLink
                  variant="primary"
                  className="dark:text-white"
                  href={project.smartwatchUrl}
                  download={project.smartwatchUrl !== "#" ? true : undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    if (project.smartwatchUrl === "#") e.preventDefault();
                  }}
                  title={project.smartwatchUrl === "#" ? (locale === "en" ? "Download link coming soon" : "Enlace de descarga disponible pronto") : undefined}
                >
                  <Download className="size-4" aria-hidden />
                  <Watch className="size-4" aria-hidden />
                  {t("downloadSmartwatch")}
                </ButtonLink>
              )}
              {project.demoUrl && (
                <ButtonLink
                  variant={project.apkUrl || project.windowsUrl || project.linuxUrl || project.smartwatchUrl ? "pill" : "primary"}
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    if (project.demoUrl === "#") e.preventDefault();
                  }}
                  title={project.demoUrl === "#" ? (locale === "en" ? "Web link coming soon" : "Enlace web disponible pronto") : undefined}
                >
                  {t("visitWeb")} <ArrowUpRight className="size-4" aria-hidden />
                </ButtonLink>
              )}
              {project.repoUrl && (
                <ButtonLink href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                  {t("repo")} <ArrowUpRight className="size-4" aria-hidden />
                </ButtonLink>
              )}
            </div>
          )}
        </aside>
      </div>

      <h2 className="mt-20 text-2xl font-medium tracking-[-0.025em] text-ink md:text-3xl">{t("gallery")}</h2>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 list-none p-0 m-0">
        {project.gallery.map((src, i) => (
          <li key={i} className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <ProjectImage src={src} alt={t("galleryAlt", { n: i + 1, name: title })} label={title} note={t("imagePending")} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
          </li>
        ))}
      </ul>
    </Section>
  );
}
