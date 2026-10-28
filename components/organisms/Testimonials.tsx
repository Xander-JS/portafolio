"use client";

import { useTranslations } from "next-intl";
import { Section } from "@/components/atoms/Section";
import { SectionHeading } from "@/components/atoms/SectionHeading";
import { TestimonialCard } from "@/components/molecules/TestimonialCard";
import { testimonials } from "@/data/testimonials";

export function Testimonials() {
  const t = useTranslations("testimonials");
  if (!testimonials.length) return null;
  return (
    <Section id="testimonials">
      <SectionHeading id="testimonials-title" title={t("heading")} intro={t("intro")} />
      <div className="grid gap-5 md:grid-cols-2 lg:gap-6">
        {testimonials.map((item) => (
          <TestimonialCard key={item.id} item={item} />
        ))}
      </div>
    </Section>
  );
}
