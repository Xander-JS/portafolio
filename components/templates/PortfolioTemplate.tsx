import { cacheLife } from "next/cache";
import type { ReactNode } from "react";
import { Footer } from "@/components/organisms/Footer";
import { Header } from "@/components/organisms/Header";

// Captured in the static page and refreshed daily, so the footer year rolls over on its own.
async function currentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

/** Page frame: nav bar, the sections in order, footer. Used by the home page and every detail page. */
export async function PortfolioTemplate({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-clip">
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer year={await currentYear()} />
    </div>
  );
}
