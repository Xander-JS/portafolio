"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type KeyboardEvent } from "react";
import { ModuleCardFace } from "@/components/molecules/ModuleCardFace";
import { ModulePanel } from "@/components/molecules/ModulePanel";
import { ShardPanel } from "@/components/molecules/ShardPanel";
import { moduleHref, modules } from "@/data/modules";
import { useLocale } from "@/i18n/Providers";
import { CARD_GLASS, DRUM, WAVE, drumOpacity, drumPose, dwell } from "@/lib/drum";
import { heroPattern } from "@/lib/shards";

const N = modules.length;
const SLICES = [-1, 0, 1]; // px: inner slices between the faces that give the card its thickness (guide)
const DEPTH = 2; // px: each face sits this far from the middle
// The glass has fully reassembled after this long; then it is unmounted again.
const GLASS_RETURN_MS = (CARD_GLASS.fly + CARD_GLASS.stagger * heroPattern.cells.length) * 1000 + 200;

// The glass needs a real hover: a mouse or trackpad, and motion allowed.
const glassQuery = "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";
const subscribeGlass = (cb: () => void) => {
  const mq = matchMedia(glassQuery);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

/**
 * The portfolio's modules on a vertical drum (promt-guide-cards.md), driven by page scroll: the section is one screen
 * per card tall and its stage sticks while you scroll through it. One rAF loop writes every card's transform and
 * opacity; React only hears when the focused card changes. The focused card floats when idle and breaks into the
 * hero's glass on hover. With reduced motion it is a plain list.
 */
export function ModuleDrum() {
  const t = useTranslations("modules");
  const locale = useLocale();
  const outer = useRef<HTMLDivElement>(null);
  const column = useRef<HTMLDivElement>(null);
  const rig = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const links = useRef<(HTMLAnchorElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [glass, setGlass] = useState(false); // the ShardPanel is mounted: hovering, or still reassembling
  const canGlass = useSyncExternalStore(subscribeGlass, () => matchMedia(glassQuery).matches, () => false);
  // Read by the loop without re-rendering: where the section starts, scroll per card, hover and last scroll time.
  const live = useRef({ top: 0, step: 1, hover: false, lastScroll: -1e9 });
  const glassTimer = useRef(0);

  // Scrolling moves focus with the drum, so a keyboard user stays on the focused card.
  useEffect(() => {
    if (links.current.includes(document.activeElement as HTMLAnchorElement)) links.current[active]?.focus({ preventScroll: true });
  }, [active]);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return; // the list is shown instead
    const el = outer.current!;
    const L = live.current;
    let h = 0;
    let cardH = 0;
    let mobile = false;
    let scrollY = window.scrollY;
    let shown = 0;
    let wave = 0;

    // Layout is read here, on resize, never inside the frame.
    const measure = () => {
      mobile = !matchMedia("(min-width: 1024px)").matches;
      h = column.current!.offsetHeight;
      // The focused card sits forward (z 400, ×1.42 through the perspective), so its box is ~60% of the column.
      const cardW = Math.min(column.current!.offsetWidth * (mobile ? 0.62 : 0.6), 420);
      cardH = Math.round(cardW / 1.5925); // the guide's landscape ratio
      rig.current!.style.width = `${cardW}px`;
      rig.current!.style.height = `${cardH}px`;
      L.top = el.getBoundingClientRect().top + window.scrollY;
      L.step = Math.max(1, (el.offsetHeight - window.innerHeight) / (N - 1));
    };
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    ro.observe(column.current!);
    const onScroll = () => {
      scrollY = window.scrollY;
      L.lastScroll = performance.now();
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    let raf = 0;
    let last = performance.now();
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!h) return;
      // Scroll through the section → 0 … N-1, with the guide's dwell. No wrap: it starts at the first card and ends at the last.
      const idx = dwell(Math.min(N - 1, Math.max(0, (scrollY - L.top) / L.step)));
      const front = Math.round(idx);
      if (front !== shown) {
        shown = front;
        L.hover = false;
        setActive(front);
        setHovered(false);
        setGlass(false);
      }
      // The wave blends in once the visitor stops scrolling and hovering, and out as soon as they start.
      const idle = !L.hover && now - L.lastScroll > WAVE.idleAfter * 1000;
      wave += ((idle ? 1 : 0) - wave) * (1 - Math.exp((-dt * 3) / WAVE.blend));
      const phase = ((now / 1000) * 2 * Math.PI) / WAVE.period;
      const fadeFrom = mobile ? DRUM.fadeFrom.mobile : DRUM.fadeFrom.desktop;

      cards.current.forEach((card, i) => {
        if (!card) return;
        const o = i - idx;
        const p = drumPose(o, h, cardH);
        const w = Math.max(0, 1 - Math.abs(o)) * wave;
        const y = p.y + Math.sin(phase) * WAVE.amplitude * w;
        const rx = p.rot + Math.cos(phase) * WAVE.tilt * w;
        card.style.opacity = drumOpacity(o, fadeFrom).toFixed(3);
        card.style.transform = `translate3d(0,${y.toFixed(1)}px,${p.z.toFixed(1)}px) rotateX(${rx.toFixed(2)}deg)`;
      });
    };

    // Run only while the section is on screen; the CSS gradient drift pauses with it.
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
      window.removeEventListener("scroll", onScroll);
      clearTimeout(glassTimer.current);
    };
  }, []);

  const scrollToCard = (i: number) => window.scrollTo({ top: live.current.top + i * live.current.step });

  const keys = (e: KeyboardEvent) => {
    const next = { ArrowDown: 1, PageDown: 1, ArrowUp: -1, PageUp: -1 }[e.key];
    if (!next) return;
    const L = live.current;
    const target = Math.round((window.scrollY - L.top) / L.step) + next;
    if (target < 0 || target > N - 1) return; // past either end the page scrolls on as usual
    e.preventDefault();
    scrollToCard(target);
  };

  const hover = (on: boolean) => {
    live.current.hover = on;
    setHovered(on);
    clearTimeout(glassTimer.current);
    if (on) setGlass(canGlass);
    else glassTimer.current = window.setTimeout(() => setGlass(false), GLASS_RETURN_MS);
  };

  const height = {
    "--drum-sm": `${(N - 1) * DRUM.scrollPerCard.mobile}svh`,
    "--drum-lg": `${(N - 1) * DRUM.scrollPerCard.desktop}svh`,
  } as CSSProperties;
  const broken = hovered && glass;

  return (
    <section id="modules" aria-label={t("heading")}>
      {/* Reduced motion: every card with its words, as a list of links. */}
      <div className="hidden px-4 py-20 motion-reduce:block md:px-[5.5vw] md:py-28">
        <h2 className="text-4xl font-medium tracking-[-0.035em] text-ink md:text-6xl">{t("heading")}</h2>
        <ul className="mt-10 grid gap-5">
          {modules.map((m, i) => (
            <li key={m.id} className="grid items-center gap-6 rounded-3xl bg-surface p-5 md:grid-cols-[minmax(0,20rem)_1fr] md:gap-10 md:p-8">
              <ModuleCardFace module={m} side="front" locale={locale} index={i} className="aspect-[1.59]" />
              <ModulePanel module={m} locale={locale} />
            </li>
          ))}
        </ul>
      </div>

      <div ref={outer} onKeyDown={keys} style={height} className="relative h-[calc(var(--drum-sm)+100svh)] motion-reduce:hidden lg:h-[calc(var(--drum-lg)+100svh)]">
        <div className="sticky top-0 grid h-svh grid-rows-[minmax(0,42fr)_minmax(0,58fr)] px-4 pt-[4.75rem] md:px-[5.5vw] md:pt-[5.5rem] lg:grid-cols-[45fr_55fr] lg:grid-rows-1 lg:gap-12">
          <div ref={column} className="relative flex items-center justify-center overflow-hidden" style={{ perspective: `${DRUM.perspective}px` }}>
            <div ref={rig} className="relative [transform-style:preserve-3d]" style={{ transform: `rotateZ(${DRUM.roll}deg)` }}>
              {modules.map((m, i) => {
                const isActive = i === active;
                return (
                  <div
                    key={m.id}
                    ref={(el) => {
                      cards.current[i] = el;
                    }}
                    data-dim={isActive ? undefined : ""}
                    onClick={(e) => {
                      // Any card but the focused one only scrolls itself into focus.
                      if (isActive) return;
                      e.preventDefault();
                      scrollToCard(i);
                    }}
                    className="absolute inset-0 cursor-pointer will-change-transform [transform-style:preserve-3d]"
                  >
                    {SLICES.map((z) => (
                      <div key={z} aria-hidden className="absolute inset-0 rounded-2xl bg-primary-900" style={{ transform: `translateZ(${z}px)` }} />
                    ))}
                    <div className="absolute inset-0 [backface-visibility:hidden]" style={{ transform: `rotateX(180deg) translateZ(${DEPTH}px)` }}>
                      <ModuleCardFace module={m} side="back" locale={locale} index={i} className="h-full" />
                    </div>
                    <div className="absolute inset-0 [backface-visibility:hidden]" style={{ transform: `translateZ(${DEPTH}px)` }}>
                      {isActive && glass && (
                        <div className="card-glass absolute inset-0">
                          <ShardPanel
                            pattern={heroPattern}
                            render={(printed) => (printed ? <ModuleCardFace module={m} side="front" locale={locale} index={i} className="h-full" /> : <div className="h-full" />)}
                            shattered={hovered}
                            tuning={CARD_GLASS}
                            className="h-full"
                          />
                        </div>
                      )}
                      {/* The whole face on top; it fades out while the glass breaks and back in once it has reassembled. */}
                      <div
                        className="absolute inset-0"
                        style={{
                          opacity: isActive && broken ? 0 : 1,
                          transition: broken ? "opacity 0.35s ease-out" : `opacity 0.4s ease-out ${glass ? CARD_GLASS.fly - 0.3 : 0}s`,
                        }}
                      >
                        <ModuleCardFace module={m} side="front" locale={locale} index={i} className="h-full" />
                      </div>
                      <Link
                        ref={(el) => {
                          links.current[i] = el;
                        }}
                        href={moduleHref(m)}
                        tabIndex={isActive ? 0 : -1}
                        aria-label={t("open", { label: m.label[locale], title: m.title[locale] })}
                        onPointerEnter={(e) => {
                          if (isActive && e.pointerType === "mouse") hover(true);
                        }}
                        onPointerLeave={(e) => {
                          if (e.pointerType === "mouse") hover(false);
                        }}
                        className="absolute inset-0 rounded-2xl"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex min-h-0 flex-col justify-center pb-6 lg:pb-10">
            <h2 className="text-sm font-medium text-primary-text lg:text-base">{t("heading")}</h2>
            <div aria-live="polite" className="mt-3 lg:mt-8">
              <div key={active} className="panel-in">
                <ModulePanel module={modules[active]} locale={locale} />
              </div>
            </div>
            <ol aria-label={t("progress")} className="mt-4 flex items-center lg:mt-10">
              {modules.map((m, i) => (
                <li key={m.id}>
                  <button
                    type="button"
                    onClick={() => scrollToCard(i)}
                    aria-label={t("dot", { n: i + 1, total: N, label: m.label[locale] })}
                    aria-current={i === active ? "step" : undefined}
                    className="group grid h-11 w-7 cursor-pointer place-items-center"
                  >
                    <span
                      className={`block h-2 rounded-full transition-colors duration-300 ${i === active ? "w-6 bg-primary" : "w-2 bg-ink/20 group-hover:bg-primary/50"}`}
                    />
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
