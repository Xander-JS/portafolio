import type { ReactNode } from "react";

/** Page section with the shared outer margins and rhythm. Its children rise in as it enters. */
export function Section({ id, children, className = "" }: { id: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`reveal px-4 py-20 md:px-[5.5vw] md:py-28 ${className}`}>
      {children}
    </section>
  );
}
