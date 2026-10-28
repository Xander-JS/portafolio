"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from "react";
import { Section } from "@/components/atoms/Section";
import { SectionHeading } from "@/components/atoms/SectionHeading";
import { ModuleCardFace } from "@/components/molecules/ModuleCardFace";
import { modules } from "@/data/modules";
import { useLocale } from "@/i18n/Providers";

const N = modules.length;
const D = 1350; // CSS perspective of the scene, px
const SLICES = [-1, 0, 1]; // px: the inner slices between the two faces that give the card its thickness
const DEPTH = 2; // px: each face sits this far from the middle
const smooth = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** Offset from the front card, wrapped onto the cylinder: [-N/2, N/2). */
const wrap = (o: number) => ((((o + N / 2) % N) + N) % N) - N / 2;

// Key poses at offsets 0, 1, 2 and 3 from the front: depth (px) and turn around Y (deg).
const Z = [120, -60, -260, -480];
const ROT = [0, 32, 62, 80];

/** Where a card sits at a given offset from the front, on a stage `w` px wide (guide: smoothstep between key poses). */
function pose(offset: number, w: number, cardW: number) {
  const a = Math.min(Math.abs(offset), 3);
  const s = Math.sign(offset);
  const seg = Math.min(Math.floor(a), 2);
  const t = smooth(a - seg);
  const x1 = cardW * 0.82 + 24;
  // Perspective-aware: the card at offset 2 peeks in from the stage edge, the one at offset 3 is fully out.
  const projHalf = (deg: number) => (cardW / 2) * Math.cos((deg * Math.PI) / 180);
  const x2 = Math.max(x1 + cardW * 0.3, (w / 2 - cardW * 0.2 + projHalf(ROT[2])) * ((D - Z[2]) / D));
  const x3 = (w / 2 + cardW) * ((D - Z[3]) / D);
  const X = [0, x1, x2, x3];
  return {
    x: s * lerp(X[seg], X[seg + 1], t),
    z: lerp(Z[seg], Z[seg + 1], t),
    rot: s * lerp(ROT[seg], ROT[seg + 1], t),
    opacity: a <= 2 ? 1 : 1 - smooth(a - 2),
  };
}

/**
 * The portfolio's modules on a horizontal 3D cylinder (promt-guide-cards.md): a continuous `pos` drives every
 * card each frame, the front card tilts toward the mouse with inertia and flips to show its quick facts.
 * Swipe, arrows, the buttons or a click on a side card rotate it. With reduced motion it is a plain grid.
 */
export function ModuleCarousel() {
  const t = useTranslations("modules");
  const locale = useLocale();
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const fronts = useRef<(HTMLButtonElement | null)[]>([]);
  const links = useRef<(HTMLAnchorElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [flipped, setFlipped] = useState<number | null>(null);
  // Read by the animation loop without re-rendering.
  const live = useRef({ pos: 0, target: 0, drag: null as null | { x: number; from: number; moved: boolean }, swiped: false, flipped: null as number | null });
  const focusAfterMove = useRef(false);

  useEffect(() => {
    live.current.flipped = flipped;
  }, [flipped]);

  // Keyboard rotation moves focus with the front card.
  useEffect(() => {
    if (focusAfterMove.current) fronts.current[active]?.focus({ preventScroll: true });
    focusAfterMove.current = false;
  }, [active]);

  useEffect(() => {
    const el = root.current!;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return; // the grid is shown instead
    const L = live.current;
    let w = 0;
    let cardW = 0;
    let shown = 0;
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const flip = modules.map(() => 0);

    // Sizes are read on resize only, never inside the frame, so the loop never forces layout.
    const ro = new ResizeObserver(() => {
      w = stage.current!.offsetWidth;
      cardW = cards.current[0]?.offsetWidth ?? 0;
    });
    ro.observe(stage.current!);

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = el.getBoundingClientRect();
      mouse.tx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
      mouse.ty = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1));
    };
    const leave = () => {
      mouse.tx = 0;
      mouse.ty = 0;
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);

    let raf = 0;
    let last = performance.now();
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!w || !cardW) return;
      const k = 1 - Math.exp(-dt / 0.12); // inertia: ~0.12 s to close most of the gap
      if (!L.drag) L.pos += (L.target - L.pos) * k;
      mouse.x += (mouse.tx - mouse.x) * k * 0.6;
      mouse.y += (mouse.ty - mouse.y) * k * 0.6;

      const front = ((Math.round(L.pos) % N) + N) % N;
      if (front !== shown) setActive((shown = front));

      cards.current.forEach((card, i) => {
        if (!card) return;
        const o = wrap(i - L.pos);
        const p = pose(o, w, cardW);
        const centre = Math.max(0, 1 - Math.abs(o));
        flip[i] += ((L.flipped === i ? 1 : 0) - flip[i]) * k * 0.9;
        card.style.opacity = p.opacity.toFixed(3);
        card.style.transform =
          `translate3d(${p.x.toFixed(1)}px,0,${p.z.toFixed(1)}px)` +
          ` rotateY(${(p.rot + mouse.x * 14 * centre).toFixed(2)}deg) rotateX(${(-mouse.y * 10 * centre).toFixed(2)}deg)` +
          ` rotateY(${(flip[i] * 180).toFixed(2)}deg)`;
      });
    };

    // Run only while the carousel is on screen; the CSS gradient drift pauses with it.
    const io = new IntersectionObserver(([e]) => {
      cancelAnimationFrame(raf);
      if (e.isIntersecting) {
        delete el.dataset.paused;
        last = performance.now();
        raf = requestAnimationFrame(frame);
      } else el.dataset.paused = "";
    });
    io.observe(el);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);

  const go = (delta: number) => {
    const L = live.current;
    L.target = Math.round(L.target) + delta;
    setFlipped(null);
  };
  const goTo = (i: number) => go(wrap(i - Math.round(live.current.target)));

  // Swipe (touch and pen; the mouse hovers and clicks instead). Vertical moves stay page scroll via touch-action.
  const down = (e: ReactPointerEvent) => {
    if (e.pointerType === "mouse") return;
    const L = live.current;
    L.drag = { x: e.clientX, from: L.pos, moved: false };
    const step = (cards.current[0]?.offsetWidth ?? 280) * 0.82 + 24;
    const onMove = (ev: PointerEvent) => {
      const dx = ev.clientX - L.drag!.x;
      if (Math.abs(dx) > 8) L.drag!.moved = true;
      L.pos = L.drag!.from - dx / step;
    };
    const onUp = (ev: PointerEvent) => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      const { moved, x } = L.drag!;
      L.drag = null;
      if (!moved) return; // a tap: the click handler takes it
      L.swiped = true; // swallow the click that follows the swipe
      setTimeout(() => (L.swiped = false), 0);
      L.target = Math.round(L.pos + (ev.clientX < x ? 0.35 : -0.35)); // a short flick still turns one card
      setFlipped(null);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  };

  const tapCard = (i: number) => {
    if (live.current.swiped) return;
    if (i !== active) return goTo(i);
    const open = flipped !== i;
    setFlipped(open ? i : null);
    // Keep focus on the face that is showing (the other one goes inert).
    requestAnimationFrame(() => (open ? links.current[i] : fronts.current[i])?.focus({ preventScroll: true }));
  };

  const keys = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      focusAfterMove.current = true;
      go(e.key === "ArrowRight" ? 1 : -1);
    } else if (e.key === "Escape" && flipped !== null) {
      setFlipped(null);
      fronts.current[flipped]?.focus({ preventScroll: true });
    }
  };

  const mod = modules[active];

  return (
    <Section id="modules" className="pt-12! md:pt-20!">
      <SectionHeading id="modules-title" title={t("heading")} intro={t("intro")} />

      {/* Reduced motion: the same cards as a plain grid, front above back. */}
      <ul className="hidden gap-5 motion-reduce:grid sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((m, i) => (
          <li key={m.id} className="flex flex-col overflow-hidden rounded-2xl">
            <ModuleCardFace module={m} side="front" index={i} className="min-h-56 rounded-b-none ring-0" />
            <ModuleCardFace module={m} side="back" index={i} repeatTitle={false} className="flex-1 rounded-t-none ring-0" />
          </li>
        ))}
      </ul>

      <div
        ref={root}
        role="region"
        aria-roledescription={t("carousel")}
        aria-label={t("heading")}
        onKeyDown={keys}
        className="motion-reduce:hidden"
      >
        <div
          ref={stage}
          onPointerDown={down}
          className="relative -mx-4 flex h-[clamp(25rem,62vw,32rem)] touch-pan-y items-center justify-center overflow-hidden select-none md:-mx-[5.5vw]"
          style={{ perspective: `${D}px` }}
        >
          <div className="relative h-[clamp(20rem,52vw,26rem)] w-[clamp(15rem,40vw,19rem)] [transform-style:preserve-3d]">
            {modules.map((m, i) => {
              const isActive = i === active;
              const isFlipped = flipped === i;
              return (
                <div
                  key={m.id}
                  ref={(el) => {
                    cards.current[i] = el;
                  }}
                  role="group"
                  aria-roledescription={t("slide")}
                  aria-label={t("position", { current: i + 1, total: N, title: m.title[locale] })}
                  onPointerEnter={(e) => {
                    if (e.pointerType === "mouse" && isActive) setFlipped(i);
                  }}
                  onPointerLeave={(e) => {
                    if (e.pointerType === "mouse" && isFlipped) setFlipped(null);
                  }}
                  onFocus={() => {
                    if (!isActive) goTo(i);
                  }}
                  className="absolute inset-0 will-change-transform [transform-style:preserve-3d]"
                >
                  {/* Volume: thin slices stacked between the faces (guide: "stacked layers"). */}
                  {SLICES.map((z) => (
                    <div key={z} aria-hidden className="absolute inset-0 rounded-2xl bg-primary-900" style={{ transform: `translateZ(${z}px)` }} />
                  ))}
                  <div className="absolute inset-0 [backface-visibility:hidden]" style={{ transform: `translateZ(${DEPTH}px)` }} inert={isFlipped}>
                    <ModuleCardFace module={m} side="front" index={i} className="h-full" />
                    <button
                      ref={(el) => {
                        fronts.current[i] = el;
                      }}
                      type="button"
                      tabIndex={isActive ? 0 : -1}
                      aria-expanded={isActive ? isFlipped : undefined}
                      aria-controls={`module-back-${m.id}`}
                      aria-label={isActive ? t("flip", { title: m.title[locale] }) : m.title[locale]}
                      onClick={() => tapCard(i)}
                      className="absolute inset-0 cursor-pointer rounded-2xl"
                    />
                  </div>
                  <div
                    className="absolute inset-0 [backface-visibility:hidden]"
                    style={{ transform: `rotateY(180deg) translateZ(${DEPTH}px)` }}
                    inert={!isFlipped}
                    onClick={(e) => {
                      // Tapping the back (not its link) turns the card over again.
                      if (!(e.target as Element).closest("a")) tapCard(i);
                    }}
                  >
                    <ModuleCardFace
                      module={m}
                      side="back"
                      index={i}
                      id={`module-back-${m.id}`}
                      linkRef={(el) => {
                        links.current[i] = el;
                      }}
                      className="h-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <p className="max-w-md text-sm text-ink-soft">{t("hint")}</p>
          <div className="flex items-center gap-3">
            <p className="text-sm font-medium text-ink tabular-nums" aria-live="polite">
              {t("position", { current: active + 1, total: N, title: mod.title[locale] })}
            </p>
            <button type="button" onClick={() => go(-1)} aria-label={t("prev")} className="grid size-11 cursor-pointer place-items-center rounded-full bg-primary-soft text-primary-soft-ink transition-colors hover:bg-primary hover:text-primary-foreground">
              <ChevronLeft className="size-5" aria-hidden />
            </button>
            <button type="button" onClick={() => go(1)} aria-label={t("next")} className="grid size-11 cursor-pointer place-items-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary-hover">
              <ChevronRight className="size-5" aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </Section>
  );
}
