"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";

/**
 * AmbientParticles
 *
 * The drifting-dots + constellation-threads background from the About section (extracted from
 * NodeReconstruction's ambient layer) as a standalone, reusable layer — without the heavy
 * DOM-reconstruction physics. A single full-viewport `fixed` canvas sits behind the page content.
 *
 * Performance (same strategy as the 3D scene):
 * - Device tier: phones/low-power machines get fewer particles and a lower pixel-ratio cap.
 * - Render pauses entirely while the tab is hidden (visibilitychange).
 * - prefers-reduced-motion: draws a single static frame, no animation loop.
 * - Pointer repulsion is wired only on fine pointers (skipped on touch).
 */

interface AmbientParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  ox: number;
  oy: number;
  ovx: number;
  ovy: number;
  r: number;
  z: number;
  colorGroup: 0 | 1 | 2;
  phase: number;
  pulseSpeed: number;
}

interface ThemeColors {
  primary: string;
  ink: string;
  inkSoft: string;
}

function readThemeColors(): ThemeColors {
  if (typeof window === "undefined") {
    return { primary: "#dc2626", ink: "#141417", inkSoft: "#4a4a52" };
  }
  const style = getComputedStyle(document.documentElement);
  return {
    primary: style.getPropertyValue("--primary").trim() || "#dc2626",
    ink: style.getPropertyValue("--ink").trim() || "#141417",
    inkSoft: style.getPropertyValue("--ink-soft").trim() || "#4a4a52",
  };
}

/** Deterministic pseudo-random generator so particle scatter is stable across reloads. */
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

export function AmbientParticles({ contained = false }: { contained?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();
  const colorsRef = useRef<ThemeColors>(readThemeColors());
  const pointerRef = useRef({ x: 0, y: 0, active: false });

  // The render loop reads colors from this ref every frame, so theme switches apply live.
  useEffect(() => {
    colorsRef.current = readThemeColors();
  }, [resolvedTheme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const lowPower =
      coarsePointer || window.innerWidth < 768 || (navigator.hardwareConcurrency ?? 8) <= 4;

    // Lighter on mobile/low-power: lower pixel-ratio cap, sparser field, fewer particles.
    const dprCap = lowPower ? 1.5 : 2;
    const areaDivisor = lowPower ? 22000 : 15000;
    const maxCount = lowPower ? 90 : 160;

    let vw = 0;
    let vh = 0;
    let dpr = 1;
    const particles: AmbientParticle[] = [];

    const setup = () => {
      const bounds = contained ? canvas.parentElement?.getBoundingClientRect() : undefined;
      vw = bounds?.width || window.innerWidth;
      vh = bounds?.height || window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, dprCap);
      canvas.width = Math.round(vw * dpr);
      canvas.height = Math.round(vh * dpr);
      canvas.style.width = `${vw}px`;
      canvas.style.height = `${vh}px`;

      const count = Math.max(50, Math.min(maxCount, Math.round((vw * vh) / areaDivisor)));
      particles.length = 0;
      let seed = 101;
      for (let i = 0; i < count; i++) {
        const r1 = seededRandom(seed++);
        const r2 = seededRandom(seed++);
        const r3 = seededRandom(seed++);
        const r4 = seededRandom(seed++);
        const r5 = seededRandom(seed++);
        const r6 = seededRandom(seed++);

        const z = 0.25 + r3 * 0.75; // depth layer
        const angle = r4 * Math.PI * 2;
        const speed = (0.14 + r5 * 0.34) * (0.45 + z * 0.65);
        const colorGroup: 0 | 1 | 2 = r6 < 0.32 ? 0 : r6 < 0.72 ? 1 : 2;

        particles.push({
          x: r1 * vw,
          y: r2 * vh,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          ox: 0,
          oy: 0,
          ovx: 0,
          ovy: 0,
          r: 0.75 + z * 1.15,
          z,
          colorGroup,
          phase: r1 * Math.PI * 2,
          pulseSpeed: 0.0012 + r5 * 0.0018,
        });
      }
    };

    setup();

    const onPointerMove = (e: PointerEvent) => {
      const bounds = contained ? canvas.getBoundingClientRect() : undefined;
      pointerRef.current.x = e.clientX - (bounds?.left ?? 0);
      pointerRef.current.y = e.clientY - (bounds?.top ?? 0);
      pointerRef.current.active = true;
    };
    const onPointerLeave = () => {
      pointerRef.current.active = false;
    };
    const onResize = () => setup();

    if (!lowPower) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerleave", onPointerLeave);
    }
    let resizeObserver: ResizeObserver | undefined;
    if (contained && canvas.parentElement) {
      resizeObserver = new ResizeObserver(onResize);
      resizeObserver.observe(canvas.parentElement);
    } else {
      window.addEventListener("resize", onResize);
    }

    const maxConnectDistSq = 105 * 105;
    const repelRadius = 135;
    const repelRadiusSq = repelRadius * repelRadius;

    const draw = (now: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, vw, vh);

      const colors = colorsRef.current;
      const palette = [colors.primary, colors.ink, colors.inkSoft];
      const wPtr = pointerRef.current;
      const count = particles.length;

      // 1. Drift + gentle breeze repulsion + spring-back offset
      for (let i = 0; i < count; i++) {
        const p = particles[i];
        const wave = Math.sin(now * p.pulseSpeed + p.phase) * 0.12;
        p.x += p.vx + wave;
        p.y += p.vy - wave * 0.7;

        if (p.x < -24) p.x = vw + 24;
        else if (p.x > vw + 24) p.x = -24;
        if (p.y < -24) p.y = vh + 24;
        else if (p.y > vh + 24) p.y = -24;

        if (wPtr.active) {
          const curX = p.x + p.ox;
          const curY = p.y + p.oy;
          const dx = curX - wPtr.x;
          const dy = curY - wPtr.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < repelRadiusSq && distSq > 0.01) {
            const dist = Math.sqrt(distSq);
            const force = Math.pow(1 - dist / repelRadius, 2) * 0.55 * p.z;
            p.ovx += (dx / dist) * force;
            p.ovy += (dy / dist) * force;
          }
        }

        p.ovx += -p.ox * 0.04;
        p.ovy += -p.oy * 0.04;
        p.ovx *= 0.88;
        p.ovy *= 0.88;
        p.ox += p.ovx;
        p.oy += p.ovy;
      }

      // 2. Constellation threads between nearby particles
      ctx.lineWidth = 0.55;
      ctx.strokeStyle = colors.primary;
      ctx.globalAlpha = 0.2;
      ctx.beginPath();
      let hasLines = false;
      for (let i = 0; i < count; i++) {
        const a = particles[i];
        const ax = a.x + a.ox;
        const ay = a.y + a.oy;
        for (let j = i + 1; j < count; j++) {
          const b = particles[j];
          const dx = ax - (b.x + b.ox);
          const dy = ay - (b.y + b.oy);
          if (dx * dx + dy * dy < maxConnectDistSq) {
            ctx.moveTo(ax, ay);
            ctx.lineTo(b.x + b.ox, b.y + b.oy);
            hasLines = true;
          }
        }
      }
      if (hasLines) ctx.stroke();

      // 3. Particles, grouped by color and depth tier
      for (let group = 0; group < 3; group++) {
        ctx.fillStyle = palette[group];

        ctx.globalAlpha = group === 0 ? 0.64 : 0.66;
        ctx.beginPath();
        for (let i = 0; i < count; i++) {
          const p = particles[i];
          if (p.colorGroup !== group || p.z >= 0.72) continue;
          const rx = p.x + p.ox;
          const ry = p.y + p.oy;
          ctx.moveTo(rx + p.r, ry);
          ctx.arc(rx, ry, p.r, 0, Math.PI * 2);
        }
        ctx.fill();

        ctx.globalAlpha = group === 0 ? 0.68 : 0.66;
        ctx.beginPath();
        for (let i = 0; i < count; i++) {
          const p = particles[i];
          if (p.colorGroup !== group || p.z < 0.72) continue;
          const rx = p.x + p.ox;
          const ry = p.y + p.oy;
          const pulseR = p.r * (0.9 + Math.sin(now * p.pulseSpeed * 1.6 + p.phase) * 0.18);
          ctx.moveTo(rx + pulseR, ry);
          ctx.arc(rx, ry, pulseR, 0, Math.PI * 2);
        }
        ctx.fill();
      }

      ctx.globalAlpha = 1;
    };

    let raf: number | null = null;
    const loop = (now: number) => {
      draw(now);
      raf = requestAnimationFrame(loop);
    };

    if (prefersReduced) {
      draw(performance.now()); // single static frame, no motion
    } else {
      raf = requestAnimationFrame(loop);
    }

    // Stop rendering while the tab is backgrounded; resume on return.
    const onVisibility = () => {
      if (document.hidden) {
        if (raf !== null) {
          cancelAnimationFrame(raf);
          raf = null;
        }
      } else if (!prefersReduced && raf === null) {
        raf = requestAnimationFrame(loop);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      if (raf !== null) cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisibility);
      resizeObserver?.disconnect();
      if (!contained) window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={contained ? "pointer-events-none absolute inset-0 z-0" : "pointer-events-none fixed inset-0 -z-10"}
    />
  );
}
