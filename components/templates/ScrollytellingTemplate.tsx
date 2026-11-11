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
  const setWarping = useScrollStore((s) => s.setWarping);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const goToContact =
      useScrollStore.getState().pendingContact ||
      params.get("step") === "contact" ||
      window.location.hash === "#contact";

    setWarping(false);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Smooth cinematic inertia scroll via Lenis. Users who ask for reduced motion get plain scrolling.
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // exponential smooth decay
      smoothWheel: !prefersReducedMotion,
      touchMultiplier: 1.5,
    });

    // Cache the scroll range so the per-scroll handler never forces a synchronous layout (reflow).
    // scrollHeight only changes on resize, so we recompute it there instead of on every scroll frame.
    const computeMax = () => document.documentElement.scrollHeight - window.innerHeight;
    let maxScroll = computeMax();

    const onScroll = () => {
      setProgress(maxScroll > 0 ? window.scrollY / maxScroll : 0);
    };

    const onResize = () => {
      maxScroll = computeMax();
      onScroll();
    };

    lenis.on("scroll", onScroll);

    let contactTimer: ReturnType<typeof setTimeout> | null = null;

    if (goToContact) {
      useScrollStore.getState().setPendingContact(false);
      window.history.replaceState(null, "", "/");

      const jumpToContact = () => {
        const max = computeMax();
        maxScroll = max;
        if (max > 0) {
          window.scrollTo({ top: max, left: 0, behavior: "instant" });
          lenis.scrollTo(max, { immediate: true });
        }
        setProgress(1);
      };

      jumpToContact();
      requestAnimationFrame(jumpToContact);
      contactTimer = setTimeout(jumpToContact, 80);
    } else {
      // Ensure clean state and instant top scroll when home is mounted normally
      setProgress(0);
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      lenis.scrollTo(0, { immediate: true });
      onScroll();
    }

    let rafId: number;
    function raf(time: number) {
      // Skip Lenis work while the tab is backgrounded (no visible scroll to animate).
      if (!document.hidden) lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    window.addEventListener("resize", onResize);
    return () => {
      if (contactTimer) clearTimeout(contactTimer);
      cancelAnimationFrame(rafId);
      lenis.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, [setWarping, setProgress]);

  return (
    <>
      {/* Full background ground behind everything. */}
      <div className="fixed inset-0 z-0 bg-ground" />

      {/* The 3D scene covers the full viewport, edge to edge with interactive node raycasting. */}
      <div className="fixed inset-0 z-0">
        <Scene />
      </div>

      {/* Header stays persistent and accessible at all times */}
      <Header />

      {/* Scrollytelling UI overlays that fade during 3D immersion transition */}
      <div
        className={`transition-opacity duration-300 ${
          isWarping ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
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
