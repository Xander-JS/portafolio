"use client";

import { Section } from "@/components/atoms/Section";
import { AmbientParticles } from "@/components/molecules/AmbientParticles";
import { ModuleHeading } from "@/components/molecules/ModuleHeading";
import { useLocale } from "@/i18n/Providers";

export function Reserved({ summary = false }: { summary?: boolean }) {
  const locale = useLocale();
  const isEn = locale === "en";

  return (
    <>
      <AmbientParticles />
      <Section id="reserved">
      <ModuleHeading id="reserved" summary={summary} />
      <div className="rounded-3xl border border-primary/30 bg-surface/65 p-8 text-ink backdrop-blur-xs md:p-12">
        <p className="font-mono text-xs font-semibold uppercase tracking-wider text-primary-text">
          {isEn ? "Reserved slot" : "Espacio reservado"}
        </p>
        <p className="mt-3 max-w-2xl text-2xl font-medium tracking-[-0.02em] text-ink md:text-3xl">
          {isEn
            ? "This module is reserved for an upcoming section."
            : "Este módulo está reservado para una próxima sección."}
        </p>
        <p className="mt-3 max-w-[60ch] text-lg leading-relaxed text-ink-soft">
          {isEn
            ? "Content will be added here soon."
            : "Próximamente se agregará el contenido de esta sección aquí."}
        </p>
      </div>
      </Section>
    </>
  );
}

