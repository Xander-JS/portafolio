"use client";

import { Quote, UserRound } from "lucide-react";
import { useTranslations } from "next-intl";
import { Section } from "@/components/atoms/Section";
import { SectionHeading } from "@/components/atoms/SectionHeading";
import { TestimonialCard } from "@/components/molecules/TestimonialCard";
import { testimonials } from "@/data/testimonials";

/** Three slots. Filled ones show the testimonial; while none is filled, one red "coming soon" panel stands in. */
export function Testimonials({ summary = false }: { summary?: boolean }) {
  const t = useTranslations("testimonials");
  const tc = useTranslations("common");
  const filled = testimonials.filter((x) => x.name);

  return (
    <Section id="testimonials">
      <SectionHeading
        id="testimonials-title"
        title={t("heading")}
        intro={t("intro")}
        level={summary ? 2 : 1}
        more={summary ? { href: "/testimonials", label: tc("viewMore"), srLabel: tc("viewMoreAbout", { section: t("heading") }) } : undefined}
      />
      {filled.length ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {testimonials.map((item) =>
            item.name ? (
              <TestimonialCard key={item.id} item={item} />
            ) : (
              <div key={item.id} className="grid min-h-64 place-items-center rounded-2xl bg-primary-soft p-7 text-center text-sm font-medium text-primary-soft-ink">
                {t("slot")}
              </div>
            ),
          )}
        </div>
      ) : (
        <div className="grid gap-10 overflow-hidden rounded-3xl bg-primary p-8 text-primary-foreground md:p-12 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-16">
          <div>
            <Quote className="size-12" aria-hidden />
            <p className="mt-6 text-3xl font-medium tracking-[-0.03em] text-balance md:text-5xl">{t("soonTitle")}</p>
            <p className="mt-4 max-w-[48ch] text-lg leading-relaxed">{t("soonBody")}</p>
          </div>
          {/* The three reserved slots, drawn as empty cards. */}
          <ul className="grid gap-3" aria-label={t("slot")}>
            {testimonials.map((item) => (
              <li key={item.id} className="flex items-center gap-4 rounded-2xl bg-primary-foreground/10 p-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-primary-foreground/15">
                  <UserRound className="size-6" aria-hidden />
                </span>
                <span className="flex-1 space-y-2" aria-hidden>
                  <span className="block h-2.5 w-2/5 rounded-full bg-primary-foreground/30" />
                  <span className="block h-2.5 w-3/4 rounded-full bg-primary-foreground/15" />
                </span>
                <span className="text-sm font-medium">{t(item.type === "video" ? "video" : "slot")}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Section>
  );
}
