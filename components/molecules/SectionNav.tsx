"use client";

import { STEP_COUNT, steps } from "@/data/steps";
import { useLocale } from "@/i18n/Providers";
import { useScrollStore } from "@/lib/useScrollStore";

// Jump to a section by scrolling to its share of the page's scroll range.
function scrollToStep(i: number) {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  window.scrollTo({ top: (i / (STEP_COUNT - 1)) * max, behavior: "smooth" });
}

/** Fixed vertical menu of section NAMES on the right edge; the active one glows Tech Red. No progress counter. */
export function SectionNav() {
  const index = useScrollStore((s) => s.index);
  const locale = useLocale();

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
              onClick={() => scrollToStep(i)}
              aria-current={i === index ? "step" : undefined}
              className={`cursor-pointer text-sm tracking-tight transition-all duration-300 ${
                i === index ? "font-semibold text-primary" : "text-ink-faint hover:text-primary-text"
              }`}
            >
              {s.label[locale]}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
