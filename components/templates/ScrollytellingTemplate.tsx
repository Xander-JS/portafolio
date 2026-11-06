"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import Lenis from "lenis";
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
  const isWarping = useScrollStore((s) => s.isWarping);

  useEffect(() => {
    // Smooth cinematic inertia scroll via Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // exponential smooth decay
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
    };

    lenis.on("scroll", onScroll);
    onScroll();

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      window.removeEventListener("resize", onScroll);
    };
  }, [setProgress]);

  return (
    <>
      {/* Full background ground behind everything. */}
      <div className="fixed inset-0 z-0 bg-ground" />

      {/* The 3D scene covers the full viewport, edge to edge with interactive node raycasting. */}
      <div className="fixed inset-0 z-0">
        <Scene />
      </div>

      <div
        className={`transition-opacity duration-300 ${
          isWarping ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <Header />
        <SectionNav />
        <LeftContent />
      </div>

      <div className="relative z-10 pointer-events-none">
        {/* Invisible scroll range: one viewport per step, passes pointer events to 3D canvas while enabling window scroll */}
        <div aria-hidden style={{ height: `calc(${STEP_COUNT} * 100svh)` }} />
        <div className="pointer-events-auto">
          <Footer year={year} />
        </div>
      </div>
    </>
  );
}
