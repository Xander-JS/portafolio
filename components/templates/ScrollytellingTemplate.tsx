"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { Footer } from "@/components/organisms/Footer";
import { Header } from "@/components/organisms/Header";
import { LeftContent } from "@/components/organisms/LeftContent";
import { SectionNav } from "@/components/molecules/SectionNav";
import { STEP_COUNT } from "@/data/steps";
import { useScrollStore } from "@/lib/useScrollStore";

// WebGL only runs in the browser, so the scene is mounted client-only (keeps three out of the SSR bundle too).
const Scene = dynamic(() => import("@/components/organisms/Scene").then((m) => m.Scene), { ssr: false });

/**
 * The scrollytelling home frame. Scrolling the tall invisible spacer drives progress 0→1; everything else is
 * fixed and layered by z-index: the 3D scene behind (z-0), the glass UI over it (z-10), the header on top (z-50).
 */
export function ScrollytellingTemplate({ year }: { year: number }) {
  const setProgress = useScrollStore((s) => s.setProgress);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [setProgress]);

  return (
    <>
      <div className="fixed inset-0 z-0 bg-ground">
        <Scene />
      </div>

      <Header />
      <SectionNav />
      <LeftContent />

      <div className="relative z-10">
        {/* Invisible scroll range: one viewport per step, so progress spans all seven steps (00–06). */}
        <div aria-hidden style={{ height: `calc(${STEP_COUNT} * 100svh)` }} />
        <Footer year={year} />
      </div>
    </>
  );
}
