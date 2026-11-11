"use client";

import { Quote } from "lucide-react";
import { useTranslations } from "next-intl";
import { Avatar } from "@/components/atoms/Avatar";
import { Badge } from "@/components/atoms/Badge";
import type { Testimonial } from "@/data/types";
import { useLocale } from "@/i18n/Providers";

const isEmbed = (url: string) => /youtube\.com|youtu\.be|vimeo\.com/.test(url);

/** A filled testimonial slot: a quote, or a video, with who said it. Empty slots are drawn by the organism. */
export function TestimonialCard({ item }: { item: Testimonial }) {
  const t = useTranslations("testimonials");
  const locale = useLocale();
  const video = item.type === "video" && item.videoUrl;

  return (
    <figure className="flex flex-col gap-8 rounded-2xl border border-black/15 bg-transparent p-7 shadow-[0_0_12px_rgba(0,0,0,0.08),0_4px_14px_-2px_rgba(0,0,0,0.16)] backdrop-blur-xs transition-all duration-300 hover:border-black/25 hover:shadow-[0_0_16px_rgba(0,0,0,0.12),0_6px_18px_-2px_rgba(0,0,0,0.22)] dark:border-white/15 dark:shadow-[0_0_12px_rgba(255,255,255,0.08),0_4px_14px_-2px_rgba(255,255,255,0.12)] dark:hover:border-white/25 dark:hover:shadow-[0_0_16px_rgba(255,255,255,0.12),0_6px_18px_-2px_rgba(255,255,255,0.18)] md:p-9">
      {video ? (
        <div className="relative aspect-video overflow-hidden rounded-xl bg-primary-950">
          {isEmbed(item.videoUrl) ? (
            <iframe
              src={item.videoUrl}
              title={t("videoTitle", { name: item.name })}
              className="absolute inset-0 size-full"
              allow="encrypted-media; picture-in-picture; fullscreen"
              loading="lazy"
            />
          ) : (
            <video src={item.videoUrl} controls preload="metadata" className="absolute inset-0 size-full object-cover" aria-label={t("videoTitle", { name: item.name })} />
          )}
        </div>
      ) : (
        <>
          <Quote className="size-9 text-primary" aria-hidden />
          <blockquote className="text-xl leading-snug tracking-[-0.01em] text-ink md:text-2xl">{item.quote[locale]}</blockquote>
        </>
      )}
      <figcaption className="mt-auto flex items-center gap-4">
        <Avatar name={item.name} photo={item.avatar} alt={item.name} size={48} />
        <span className="min-w-0 flex-1">
          <span className="block font-medium text-ink">{item.name}</span>
          <span className="block text-sm text-ink-faint">{item.role[locale]}</span>
        </span>
        {video && <Badge>{t("video")}</Badge>}
      </figcaption>
    </figure>
  );
}
