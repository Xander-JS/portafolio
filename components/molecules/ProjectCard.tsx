"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/atoms/Badge";
import { ProjectImage } from "@/components/atoms/ProjectImage";
import { Tag } from "@/components/atoms/Tag";
import type { Project } from "@/data/types";
import { useLocale } from "@/i18n/Providers";

export function ProjectCard({ project, featured = false }: { project: Project; featured?: boolean }) {
  const t = useTranslations("projects");
  const locale = useLocale();
  const title = project.title[locale];

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-2xl bg-surface transition-transform duration-300 ease-out hover:-translate-y-1 has-[a:focus-visible]:-translate-y-1 motion-reduce:transform-none ${featured ? "md:col-span-2 md:grid md:grid-cols-[1.3fr_1fr]" : ""}`}
    >
      <div className={`relative m-2 overflow-hidden rounded-xl ${featured ? "aspect-[16/10] md:aspect-auto md:min-h-80" : "aspect-[16/10]"}`}>
        <ProjectImage src={project.cover} alt={t("imageAlt", { name: title })} label={title} note={t("imagePending")} sizes="(min-width: 768px) 50vw, 100vw" />
      </div>
      <div className="flex flex-1 flex-col p-6 md:p-8">
        <div className="flex flex-wrap gap-2">
          <Badge tone="solid">{t(`type.${project.type}`)}</Badge>
          <Badge>{t(`status.${project.status}`)}</Badge>
        </div>
        <h3 className={`mt-4 font-medium tracking-[-0.025em] text-ink ${featured ? "text-3xl md:text-4xl" : "text-2xl"}`}>
          {/* The link covers the whole card. */}
          <Link href={`/projects/${project.slug}`} className="after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none">
            {title}
          </Link>
        </h3>
        <p className="mt-3 text-base leading-relaxed text-ink-soft">{project.summary[locale]}</p>
        <ul className="mt-5 flex flex-wrap gap-2" aria-label={t("stack")}>
          {project.stack.map((s) => (
            <Tag key={s}>{s}</Tag>
          ))}
        </ul>
        <p className="mt-auto flex items-center justify-between gap-4 pt-6 text-sm">
          <span className="inline-flex items-center gap-1.5 font-medium text-primary-text">
            {t("details")}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
          </span>
          <span className="text-ink-faint">{project.duration[locale]}</span>
        </p>
      </div>
      {/* The card's own focus ring, since the stretched link's outline would only wrap the title. */}
      <span aria-hidden className="pointer-events-none absolute inset-0 hidden rounded-2xl outline-2 outline-offset-4 outline-primary-ring outline-solid group-has-[a:focus-visible]:block" />
    </article>
  );
}
