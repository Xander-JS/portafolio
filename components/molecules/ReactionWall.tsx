"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { supabase } from "@/lib/supabase";

/**
 * ReactionWall — the interactive heart of the "Reservada" section.
 *
 * Visitors tap an emoji and their reaction joins everyone else's: each tap bumps an optimistic
 * local count, fires a little particle burst, and calls the Supabase `increment_reaction` RPC so
 * the total accumulates across all visitors in real time. A `localStorage` guard keeps one tap per
 * reaction per browser (best-effort, not security).
 *
 * Progressive & cheap, matching SkillNexus: SSR / no-JS / reduced-motion render the same buttons and
 * counts without the canvas; the particle loop only runs while a burst is alive and pauses when the
 * tab is hidden; the pixel-ratio is capped and colours are read from the live CSS custom properties.
 * Without the Supabase env vars the client is null, so the buttons disable and dev/build never break.
 */

const REACTIONS = [
  { key: "celebrate", emoji: "👏" },
  { key: "fire", emoji: "🔥" },
  { key: "idea", emoji: "💡" },
  { key: "love", emoji: "❤️" },
  { key: "rocket", emoji: "🚀" },
] as const;

type Key = (typeof REACTIONS)[number]["key"];

const STORAGE_KEY = "reactions:reacted";
const emptySubscribe = () => () => {};

/** True on the client, false during SSR — without calling setState inside an effect. */
function useMounted() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

/** Tracks the OS "reduce motion" preference, reactively. */
function useReducedMotion() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

function loadReacted(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const arr = raw ? JSON.parse(raw) : null;
    return Array.isArray(arr) ? new Set(arr) : new Set();
  } catch {
    return new Set();
  }
}

function saveReacted(set: Set<string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
  } catch {
    /* private mode / blocked storage — the in-memory state still works for this visit */
  }
}

type Particle = { x: number; y: number; vx: number; vy: number; r: number; life: number; maxLife: number };

export function ReactionWall() {
  const t = useTranslations("reactions");
  const mounted = useMounted();
  const reduced = useReducedMotion();
  const ready = Boolean(supabase);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number | null>(null);
  const spawnRef = useRef<((x: number, y: number) => void) | null>(null);

  const [counts, setCounts] = useState<Record<string, number> | null>(null);
  const [reacted, setReacted] = useState<Set<string>>(new Set());
  const [pending, setPending] = useState<Set<string>>(new Set());

  // Load the browser's "already reacted" set + the shared counts from Supabase on mount.
  useEffect(() => {
    setReacted(loadReacted());
    if (!supabase) {
      setCounts({});
      return;
    }
    let cancelled = false;
    supabase
      .from("reactions")
      .select("key, count")
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error || !data) {
          setCounts({});
          return;
        }
        const map: Record<string, number> = {};
        for (const row of data as { key: string; count: number }[]) map[row.key] = row.count;
        setCounts(map);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Particle-burst engine. Skipped entirely under reduced motion; the loop only runs while a burst
  // is alive (started on demand from a tap) and stops when the tab is hidden or the burst fades.
  useEffect(() => {
    if (!mounted || reduced) return;
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = 1;
    const resize = () => {
      const rect = host.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    let primary = "#dc2626";
    const readColor = () => {
      const v = getComputedStyle(document.documentElement).getPropertyValue("--primary").trim();
      if (v) primary = v;
    };
    readColor();

    const tick = () => {
      const ps = particlesRef.current;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      for (let i = ps.length - 1; i >= 0; i--) {
        const p = ps[i];
        p.vy += 0.12; // gravity
        p.vx *= 0.99;
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 1;
        if (p.life <= 0) {
          ps.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
        ctx.fillStyle = primary;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      rafRef.current = ps.length > 0 && !document.hidden ? requestAnimationFrame(tick) : null;
    };

    spawnRef.current = (x, y) => {
      readColor();
      const n = 18;
      for (let i = 0; i < n; i++) {
        const ang = (Math.PI * 2 * i) / n + Math.random() * 0.5;
        const sp = 2 + Math.random() * 3.6;
        const maxLife = 40 + Math.random() * 22;
        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(ang) * sp,
          vy: Math.sin(ang) * sp - 1.6,
          r: 2 + Math.random() * 3,
          life: maxLife,
          maxLife,
        });
      }
      if (rafRef.current === null) rafRef.current = requestAnimationFrame(tick);
    };

    const onVisibility = () => {
      if (document.hidden && rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
        particlesRef.current = [];
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      particlesRef.current = [];
      spawnRef.current = null;
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [mounted, reduced]);

  const handleReact = (key: Key, event: React.MouseEvent<HTMLButtonElement>) => {
    if (!ready || reacted.has(key) || pending.has(key)) return;

    // Optimistic bump + remember this browser already reacted.
    setCounts((c) => ({ ...(c ?? {}), [key]: (c?.[key] ?? 0) + 1 }));
    const nextReacted = new Set(reacted).add(key);
    setReacted(nextReacted);
    saveReacted(nextReacted);

    // Burst from the button's centre.
    const canvas = canvasRef.current;
    const spawn = spawnRef.current;
    if (canvas && spawn) {
      const cr = canvas.getBoundingClientRect();
      const br = event.currentTarget.getBoundingClientRect();
      spawn(br.left + br.width / 2 - cr.left, br.top + br.height / 2 - cr.top);
    }

    // Persist + reconcile with the authoritative server count.
    setPending((p) => new Set(p).add(key));
    supabase!.rpc("increment_reaction", { reaction_key: key }).then(({ data, error }) => {
      setPending((p) => {
        const n = new Set(p);
        n.delete(key);
        return n;
      });
      if (!error && typeof data === "number") {
        setCounts((c) => ({ ...(c ?? {}), [key]: data }));
      }
    });
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-transparent bg-transparent shadow-[0_0_12px_rgba(0,0,0,0.08),0_4px_14px_-2px_rgba(0,0,0,0.16)] dark:shadow-[0_0_12px_rgba(255,255,255,0.08),0_4px_14px_-2px_rgba(255,255,255,0.12)] p-8 text-ink md:p-12">
      <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 z-0" />

      <div className="relative z-10">
        <p className="font-mono text-xs font-semibold uppercase tracking-wider text-primary-text">
          {t("eyebrow")}
        </p>
        <p className="mt-3 max-w-2xl text-2xl font-medium tracking-[-0.02em] text-ink md:text-3xl">
          {t("title")}
        </p>
        <p className="mt-3 max-w-[60ch] text-lg leading-relaxed text-ink-soft">{t("hint")}</p>

        <ul className="mt-8 flex flex-wrap gap-3 md:gap-4" aria-label={t("eyebrow")}>
          {REACTIONS.map((rx) => {
            const on = reacted.has(rx.key);
            const count = counts?.[rx.key] ?? 0;
            return (
              <li key={rx.key}>
                <button
                  type="button"
                  onClick={(e) => handleReact(rx.key, e)}
                  disabled={on || !ready}
                  aria-pressed={on}
                  aria-label={t("aria", { reaction: t(`labels.${rx.key}`), count })}
                  className={`group flex items-center gap-2.5 rounded-full border px-4 py-2.5 transition-all duration-200 ${
                    on
                      ? "border-primary bg-primary-soft text-primary-soft-ink shadow-[0_6px_18px_-8px_var(--primary)]"
                      : "border-primary/20 bg-surface/70 text-ink enabled:hover:-translate-y-0.5 enabled:hover:border-primary/60 enabled:hover:shadow-[0_10px_26px_-12px_var(--primary)]"
                  } ${!ready ? "cursor-not-allowed opacity-60" : on ? "" : "cursor-pointer"}`}
                  style={{ backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}
                >
                  <span
                    aria-hidden
                    className="text-2xl leading-none transition-transform duration-200 group-active:scale-125 motion-reduce:transition-none motion-reduce:group-active:scale-100 md:text-[26px]"
                  >
                    {rx.emoji}
                  </span>
                  <span className="min-w-[2ch] text-right font-mono text-sm font-semibold tabular-nums text-ink-soft">
                    {counts === null ? "·" : count}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <p className="mt-6 min-h-[1.25rem] font-mono text-[11px] text-ink-faint" aria-live="polite">
          {!ready ? t("offline") : reacted.size > 0 ? t("thanks") : " "}
        </p>
      </div>
    </div>
  );
}
