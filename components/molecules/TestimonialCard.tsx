"use client";

import { useTranslations } from "next-intl";
import { Avatar } from "@/components/atoms/Avatar";
import { Glass } from "@/components/atoms/Glass";
import type { Testimonial } from "@/data/types";

export function TestimonialCard({ item }: { item: Testimonial }) {
  const t = useTranslations("testimonials");
  return (
    <Glass as="figure" interactive className="flex flex-col justify-between gap-10 p-7 md:p-9">
      <blockquote className="text-xl leading-snug tracking-[-0.01em] text-ink md:text-2xl">
        “{t(`items.${item.id}.quote`)}”
      </blockquote>
      <figcaption className="flex items-center gap-4">
        <Avatar name={item.name} photo={item.photo} alt={item.name} size={48} />
        <span>
          <span className="block font-medium text-ink">{item.name}</span>
          <span className="block text-sm text-ink-faint">{t(`items.${item.id}.role`)}</span>
        </span>
      </figcaption>
    </Glass>
  );
}
