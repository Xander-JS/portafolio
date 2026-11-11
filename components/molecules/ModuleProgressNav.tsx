"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { moduleHref, modules } from "@/data/modules";
import { useLocale } from "@/i18n/Providers";
import { isPlainClick, runModuleTransition } from "@/lib/moduleTransition";
import { useScrollStore } from "@/lib/useScrollStore";

export function ModuleProgressNav() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();

  const currentIndex = modules.findIndex((m) => {
    const href = moduleHref(m);
    return pathname === href || pathname.startsWith(`${href}/`);
  });

  if (currentIndex === -1) return null;

  const currentStep = currentIndex + 1;
  const totalSteps = modules.length;
  const nextModule = modules[currentIndex + 1];

  const nextHref = nextModule ? moduleHref(nextModule) : "/?step=contact";
  const nextLabel = nextModule
    ? locale === "en"
      ? `Next: ${nextModule.label.en}`
      : `Siguiente: ${nextModule.label.es}`
    : locale === "en"
      ? "Finish: Contact"
      : "Finalizar: Contacto";

  /**
   * Plays the cinematic camera move on the current page, then navigates:
   * - forward dive into the next module, or
   * - a pullback that recedes the current node and opens up Contact (last step).
   * The arriving page's NodeReconstruction handles the camera settling onto the new node.
   * Falls back to an instant navigation when motion is reduced or <main> isn't found.
   */
  const handleNext = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isPlainClick(e)) return; // let new-tab / modified clicks behave normally

    // The last step returns to the home page's Contact section.
    if (!nextModule) {
      useScrollStore.getState().setPendingContact(true);
    }

    const handled = runModuleTransition(nextModule ? "forward" : "pullback", () =>
      router.push(nextHref),
    );
    if (handled) e.preventDefault();
  };

  return (
    <div className="relative z-20 mb-4 flex justify-end">
      <div className="inline-flex items-center gap-3 rounded-full border border-primary/25 bg-surface/80 py-1.5 pr-2 pl-4 backdrop-blur-md shadow-xs">
        <div
          className="hidden items-center gap-1.5 sm:flex"
          aria-label={locale === "en" ? "Module progress" : "Progreso de módulos"}
        >
          {modules.map((m, idx) => {
            const step = idx + 1;
            return (
              <span
                key={m.id}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  step === currentStep
                    ? "w-6 bg-primary"
                    : step < currentStep
                      ? "w-3 bg-primary/60"
                      : "w-3 bg-ink/15"
                }`}
              />
            );
          })}
        </div>

        <span className="font-mono text-xs font-medium text-ink-faint">
          0{currentStep} / 0{totalSteps}
        </span>

        <Link
          href={nextHref}
          scroll={Boolean(nextModule)}
          onClick={handleNext}
          className="group inline-flex cursor-pointer items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold tracking-wide text-primary-text transition-all duration-300 hover:border-primary hover:bg-primary hover:text-primary-foreground hover:shadow-[0_0_16px_rgba(240,67,89,0.35)] active:scale-95"
        >
          <span>{nextLabel}</span>
          <ArrowRight
            className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
            aria-hidden
          />
        </Link>
      </div>
    </div>
  );
}

