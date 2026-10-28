"use client";

import { useEffect, useId, useRef, type ReactNode, type SyntheticEvent } from "react";
import { centroid, contains, inset, livePoints, roundedPath, type CutPattern, type Pt } from "@/lib/shards";

/** How the pieces move. The defaults are the hero's; a card on hover uses a slower, closer set (lib/drum.ts). */
export type ShardTuning = {
  /** s each piece takes to move. */
  fly: number;
  /** s between pieces. */
  stagger: number;
  /** Displacement factor (1 = the hero's). */
  spread: number;
  /** Fade the pieces as they fly away. */
  fade: boolean;
  /** Tilt toward the pointer (1 = the hero's). */
  tilt: number;
  /** Easing of the break (0 → 1) and of the return (0 → 1). */
  outEase: (p: number) => number;
  inEase: (p: number) => number;
};

const easeOutBack = (p: number) => 1 + 2.70158 * (p - 1) ** 3 + 1.70158 * (p - 1) ** 2;
const HERO: ShardTuning = { fly: 0.72, stagger: 0.03, spread: 1, fade: true, tilt: 1, outEase: (p) => p ** 3, inEase: easeOutBack };

type Props = {
  pattern: CutPattern;
  /** Called twice: once for the real, interactive copy (printed=false) and once per shard (printed=true). */
  render: (printed: boolean) => ReactNode;
  shattered?: boolean;
  /** Fly the pieces in on first load. */
  enter?: boolean;
  tuning?: ShardTuning;
  className?: string;
};

type Flight = { x: number; y: number; z: number; ang: number; ax: [number, number, number] };
type Phase = "idle" | "out" | "gone" | "in";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

function makeFlights(polys: Pt[][], w: number, h: number, S: number, spread: number): Flight[] {
  return polys.map((poly) => {
    const c = centroid(poly);
    const dx = c.x - w / 2;
    const dy = c.y - h / 2;
    const d = Math.hypot(dx, dy) || 1;
    const out = w * (0.35 + Math.random() * 0.35) * spread;
    const a = [Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5];
    const al = Math.hypot(...a) || 1;
    return {
      x: (dx / d) * out,
      y: (dy / d) * out * 0.5 + h * (0.35 + Math.random() * 0.25) * spread, // outward, plus gravity
      z: (420 + Math.random() * 380) * Math.max(S, 0.4) * spread,
      ang: (2 + Math.random() * 1.6) * spread,
      ax: [a[0] / al, a[1] / al, a[2] / al],
    };
  });
}

/**
 * A panel cut into thick smoked-glass shards (promt-guide.md). The content is printed on every shard,
 * the slab tilts toward the mouse, the shard under it lifts and tips, and `shattered` flies them away.
 */
export function ShardPanel({ pattern, render, shattered = false, enter = false, tuning = HERO, className = "" }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const shards = useRef<(HTMLDivElement | null)[]>([]);
  const anim = useRef<{ phase: Phase; start: number; flights: Flight[] }>({
    phase: enter ? "in" : "idle",
    start: -1,
    flights: [],
  });
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");

  useEffect(() => {
    const a = anim.current;
    if (shattered && (a.phase === "idle" || a.phase === "in")) Object.assign(a, { phase: "out", start: -1 });
    if (!shattered && (a.phase === "out" || a.phase === "gone")) Object.assign(a, { phase: "in", start: -1 });
  }, [shattered]);

  useEffect(() => {
    const root = wrap.current!;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = root.offsetWidth;
    let h = root.offsetHeight;
    let onScreen = true;
    let pointer: Pt | null = null;
    let glow = 0;
    const tilt = { x: 0.8, y: -1.2 };
    const lift = pattern.cells.map(() => ({ x: 0, v: 0, dx: 0, dy: 0 }));

    const ro = new ResizeObserver(() => {
      w = root.offsetWidth;
      h = root.offsetHeight;
    });
    ro.observe(root);
    const io = new IntersectionObserver(([e]) => (onScreen = e.isIntersecting));
    io.observe(root);
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || reduce) return; // no hover on touch
      const r = root.getBoundingClientRect();
      pointer = { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height };
    };
    const leave = () => (pointer = null);
    root.addEventListener("pointermove", move);
    root.addEventListener("pointerleave", leave);

    let raf = 0;
    let last = performance.now();
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!onScreen || !w || !h) return;
      root.dataset.ready = ""; // CSS: until now the real copy is shown plainly (no-JS fallback)

      const S = w / 1730;
      const gap = Math.max(14 * S, 6);
      const radius = Math.max(20 * S, 8);
      const depth = Math.max(13 * S, 4);
      const k = 1 - Math.exp(-dt / 0.3);

      // Global tilt, as if the slab were pressed at the pointer.
      const px = pointer ? pointer.x * 2 - 1 : 0;
      const py = pointer ? pointer.y * 2 - 1 : 0;
      tilt.y += ((px * 7 - 1.2) * tuning.tilt - tilt.y) * k;
      tilt.x += ((-py * 5.5 + 0.8) * tuning.tilt - tilt.x) * k;
      glow += ((pointer ? 1 : 0) - glow) * k;
      stage.current!.style.transform = reduce ? "" : `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`;

      const pts = livePoints(pattern, reduce ? 0 : now / 1000, pointer, h > w * 1.1);
      const polys = pattern.cells.map((c) => c.map((n) => ({ x: pts[n].x * w, y: pts[n].y * h })));
      const pp = pointer && { x: pointer.x * w, y: pointer.y * h };
      const hovered = pp ? polys.findIndex((p) => contains(p, pp)) : -1;

      const a = anim.current;
      if (a.start < 0) {
        a.start = now;
        if (a.phase === "out" || !a.flights.length) a.flights = makeFlights(polys, w, h, S, tuning.spread);
      }
      const t = (now - a.start) / 1000;
      const total = tuning.fly + tuning.stagger * polys.length;
      if (a.phase === "out" && (reduce || t > total)) a.phase = "gone";
      if (a.phase === "in" && (reduce || t > total)) a.phase = "idle";

      const g = document.getElementById(`${id}-glow`);
      if (pp && g) {
        g.setAttribute("cx", String(pp.x));
        g.setAttribute("cy", String(pp.y));
        g.setAttribute("r", String(Math.max(300 * S, 140)));
      }

      polys.forEach((poly, i) => {
        const el = shards.current[i];
        if (!el) return;
        const d = roundedPath(inset(poly, gap / 2), radius);
        el.querySelector("path")!.setAttribute("d", d);
        (el.lastElementChild as HTMLElement).style.clipPath = `path("${d}")`;
        el.querySelector<SVGUseElement>(".edge")!.setAttribute("transform", `translate(0 ${depth})`);

        // Lift spring (k 170, c 19); the edge nearest the pointer dips away.
        const s = lift[i];
        const c = centroid(poly);
        if (i === hovered && pp) {
          s.dx = Math.max(-1, Math.min(1, (pp.x - c.x) / (w * 0.25)));
          s.dy = Math.max(-1, Math.min(1, (pp.y - c.y) / (h * 0.3)));
        }
        s.v += (170 * ((i === hovered ? 1 : 0) - s.x) - 19 * s.v) * dt;
        s.x += s.v * dt;
        el.querySelector<SVGUseElement>(".sheen")!.style.opacity = String(clamp01(s.x));
        el.querySelector<SVGUseElement>(".glow")!.style.opacity = String(glow);

        // Flight: 0 = in place, 1 = gone; the easings come from `tuning`.
        const p = clamp01((t - i * tuning.stagger) / tuning.fly);
        let e = 0;
        if (a.phase === "out") e = tuning.outEase(p);
        else if (a.phase === "gone") e = 1;
        else if (a.phase === "in") e = 1 - tuning.inEase(p);
        const f = a.flights[i];
        el.style.opacity = String(!tuning.fade ? 1 : reduce ? (e > 0.5 ? 0 : 1) : clamp01(1 - e * 1.1));
        if (reduce) return void (el.style.transform = "");
        el.style.transformOrigin = `${c.x}px ${c.y}px`;
        el.style.transform =
          `translate3d(${f.x * e}px, ${f.y * e}px, ${f.z * e + 50 * Math.max(S, 0.5) * s.x}px)` +
          ` rotate3d(${f.ax.join(",")}, ${f.ang * e}rad)` +
          ` rotateX(${-s.dy * 0.24 * s.x}rad) rotateY(${s.dx * 0.24 * s.x}rad)`;
      });
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      root.removeEventListener("pointermove", move);
      root.removeEventListener("pointerleave", leave);
    };
  }, [pattern, id, tuning]);

  // The printed copies mirror hover / focus of real elements marked with data-hit.
  const syncHit = (e: SyntheticEvent) => {
    const hit = (e.target as Element).closest?.("[data-hit]")?.getAttribute("data-hit");
    wrap.current!.dataset.hitActive = hit ?? "";
  };
  const clearHit = () => (wrap.current!.dataset.hitActive = "");

  return (
    <div ref={wrap} className={`shard-panel relative [perspective:1600px] ${className}`}>
      <div ref={stage} className="relative h-full [transform-style:preserve-3d]">
        <svg className="absolute size-0" aria-hidden>
          <defs>
            <radialGradient id={`${id}-glow`} gradientUnits="userSpaceOnUse" cx="0" cy="0" r="200">
              <stop offset="0" style={{ stopColor: "var(--glow)" }} />
              <stop offset="1" stopOpacity="0" style={{ stopColor: "var(--glow)" }} />
            </radialGradient>
            <linearGradient id={`${id}-studio`} x1="0" y1="0" x2="0.8" y2="1">
              <stop offset="0" style={{ stopColor: "var(--glass-studio)" }} />
              <stop offset="0.6" stopOpacity="0" style={{ stopColor: "var(--glass-studio)" }} />
            </linearGradient>
            <linearGradient id={`${id}-sheen`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopOpacity="0.22" style={{ stopColor: "var(--primary)" }} />
              <stop offset="0.45" stopOpacity="0" style={{ stopColor: "var(--primary)" }} />
              <stop offset="0.6" stopOpacity="0" style={{ stopColor: "var(--red-300)" }} />
              <stop offset="1" stopOpacity="0.26" style={{ stopColor: "var(--red-300)" }} />
            </linearGradient>
          </defs>
        </svg>

        {pattern.cells.map((_, i) => {
          const href = `#${id}-p${i}`;
          return (
            <div
              key={i}
              ref={(el) => {
                shards.current[i] = el;
              }}
              // Flat on purpose: its two layers are coplanar, and preserve-3d let nested 3D (a drum card) sort the face over the print.
              className="pointer-events-none absolute inset-0 will-change-transform"
              aria-hidden
            >
              <svg className="absolute inset-0 size-full overflow-visible">
                <defs>
                  <path id={`${id}-p${i}`} />
                </defs>
                <use href={href} className="edge" style={{ fill: "var(--glass-edge)" }} />
                <use href={href} style={{ fill: "var(--glass-face)" }} />
                <use href={href} fill={`url(#${id}-studio)`} />
                <use href={href} className="glow" fill={`url(#${id}-glow)`} />
                <use href={href} className="sheen" fill={`url(#${id}-sheen)`} style={{ opacity: 0 }} />
                <use href={href} fill="none" strokeWidth="1" style={{ stroke: "var(--glass-rim)" }} />
              </svg>
              <div className="print absolute inset-0" inert>
                {render(true)}
              </div>
            </div>
          );
        })}

        <div
          className={`ghost relative h-full ${shattered ? "invisible" : ""}`}
          onPointerOver={syncHit}
          onPointerLeave={clearHit}
          onFocus={syncHit}
          onBlur={clearHit}
        >
          {render(false)}
        </div>
      </div>
    </div>
  );
}
