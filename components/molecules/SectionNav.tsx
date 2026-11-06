"use client";

import { ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { STEP_COUNT, steps } from "@/data/steps";
import { useLocale } from "@/i18n/Providers";
import { useScrollStore } from "@/lib/useScrollStore";

// Jump to a section by scrolling to its share of the page's scroll range.
function scrollToStep(i: number) {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  window.scrollTo({ top: (i / (STEP_COUNT - 1)) * max, behavior: "smooth" });
}

/** Fixed vertical menu of section NAMES on the right edge; the active one glows Tech Red with an explore arrow. */
export function SectionNav() {
  const router = useRouter();
  const index = useScrollStore((s) => s.index);
  const setWarping = useScrollStore((s) => s.setWarping);
  const locale = useLocale();

  const handleStepClick = (i: number) => {
    const href = steps[i]?.href;
    if (i === index && href) {
      setWarping(true);
      setTimeout(() => {
        router.push(href);
      }, 280);
      return;
    }
    scrollToStep(i);
  };

  return (
    <nav
      aria-label={locale === "en" ? "Sections" : "Secciones"}
      className="fixed top-1/2 right-4 z-10 hidden -translate-y-1/2 md:block md:right-6"
    >
      <ul className="flex flex-col items-end gap-3 text-right">
        {steps.map((s, i) => (
          <li key={i}>
            <button
              type="button"
              onClick={() => handleStepClick(i)}
              aria-current={i === index ? "step" : undefined}
              className={`group inline-flex cursor-pointer items-center gap-1.5 text-sm tracking-tight transition-all duration-300 ${
                i === index ? "font-semibold text-primary" : "text-ink-faint hover:text-primary-text"
              }`}
            >
              <span>{s.label[locale]}</span>
              {i === index && Boolean(s.href) && (
                <ArrowUpRight className="size-3.5 opacity-80 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
              )}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
