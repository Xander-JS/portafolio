import type { ReactNode } from "react";
import { Footer } from "@/components/organisms/Footer";
import { Header } from "@/components/organisms/Header";

/** Page frame: nav slab, the sections in order, footer. */
export function PortfolioTemplate({ children, year }: { children: ReactNode; year: number }) {
  return (
    <div className="overflow-x-clip">
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer year={year} />
    </div>
  );
}
