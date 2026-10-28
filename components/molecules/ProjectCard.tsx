"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Glass } from "@/components/atoms/Glass";
import { Tag } from "@/components/atoms/Tag";
import type { Project } from "@/data/types";

export function ProjectCard({ project, featured = false }: { project: Project; featured?: boolean }) {
  const t = useTranslations("projects");
  const name = t(`items.${project.id}.name`);
  const links = [
    { href: project.demoUrl, label: t("demo") },
    { href: project.repoUrl, label: t("repo") },
  ].filter((l) => l.href);

  return (
    <Glass
      as="article"
      interactive
      className={`flex flex-col overflow-hidden ${featured ? "md:col-span-2 md:grid md:grid-cols-[1.3fr_1fr]" : ""}`}
    >
      <div className={`relative m-2 overflow-hidden rounded-[14px] bg-ink/[0.06] ${featured ? "aspect-[16/10] md:aspect-auto md:min-h-80" : "aspect-[16/10]"}`}>
        {project.image ? (
          <Image src={project.image} alt={t("imageAlt", { name })} fill className="object-cover" sizes="(min-width: 768px) 50vw, 100vw" />
        ) : (
          // No screenshot yet: a cut-glass placeholder with the project's initial.
          <svg viewBox="0 0 160 100" className="absolute inset-0 size-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
            <path d="M0 0H52L70 72L44 100H0Z M58 0H160V44L76 62Z M80 68L160 50V100H50Z" className="fill-ink/[0.05]" />
            <text x="50%" y="56%" textAnchor="middle" className="fill-ink/25 text-[34px] font-medium">
              {name.replace(/\[TODO\s*/, "").charAt(0)}
            </text>
          </svg>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6 md:p-8">
        <h3 className={`font-medium tracking-[-0.025em] text-ink ${featured ? "text-3xl md:text-4xl" : "text-2xl"}`}>{name}</h3>
        <p className="mt-3 text-base leading-relaxed text-ink-soft">{t(`items.${project.id}.description`)}</p>
        <ul className="mt-5 flex flex-wrap gap-2" aria-label="Tech">
          {project.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </ul>
        <div className="mt-auto flex flex-wrap gap-x-5 pt-6">
          {links.length ? (
            links.map((l) => (
              <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className="inline-flex h-11 items-center gap-1 text-sm font-medium text-ink underline decoration-transparent underline-offset-4 transition-colors hover:decoration-current">
                {l.label} <ArrowUpRight className="size-4" aria-hidden />
              </a>
            ))
          ) : (
            <span className="inline-flex h-11 items-center text-sm text-ink-faint">{t("soon")}</span>
          )}
        </div>
      </div>
    </Glass>
  );
}
