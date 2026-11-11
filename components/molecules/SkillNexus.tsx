"use client";

import { useTheme } from "next-themes";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/atoms/Icon";
import { skillGroups } from "@/data/skills";
import type { IconName, SkillGroup } from "@/data/types";

type Flat = { id: string; icon: IconName; category: SkillGroup["id"] };

// Every skill flattened with the category it belongs to, in source order.
const flatSkills: Flat[] = skillGroups.flatMap((g) => g.skills.map((s) => ({ ...s, category: g.id })));
const categories: SkillGroup["id"][] = skillGroups.map((g) => g.id);
const lightIconsInDark = new Set<IconName>([
  "nextjs",
  "code",
  "cursor",
  "opencode",
  "github",
  "chat",
  "team",
  "languages",
]);

const emptySubscribe = () => () => { };

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

/** One skill node: a glass orb with the brand icon centred and the label beneath it. Sizes come from the `--orb` CSS var. */
function NodeOrb({ icon, label }: { icon: IconName; label: string }) {
  return (
    <>
      <span
        className="orb grid place-items-center rounded-full transition-transform duration-200 ease-out group-hover:scale-[1.12]"
        style={{
          width: "var(--orb)",
          height: "var(--orb)",
          background:
            "radial-gradient(135% 135% at 30% 22%, color-mix(in srgb, var(--surface) 90%, transparent), color-mix(in srgb, var(--surface) 52%, transparent))",
          border: "1px solid var(--glass-line)",
          boxShadow:
            "inset 0 1px 2px var(--glass-rim), 0 12px 32px -14px rgb(0 0 0 / 0.55), 0 0 0 1px color-mix(in srgb, var(--primary) 16%, transparent)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
        }}
      >
        <Icon
          name={icon}
          colored
          className={`size-[calc(var(--orb)*0.36)] ${lightIconsInDark.has(icon) ? "dark:[filter:brightness(0)_invert(1)]" : ""}`}
        />
      </span>
      <span
        className="pointer-events-none mt-2 block text-center text-[11px] font-bold leading-tight text-ink md:text-xs"
        style={{ width: "calc(var(--orb) * 1.7)", textShadow: "0 1px 10px var(--ground), 0 0 2px var(--ground)" }}
      >
        {label}
      </span>
    </>
  );
}

/**
 * SkillNexus — the skills as a living, linked field of nodes (orbs): each bubble carries a brand icon
 * with its label beneath, and thin constellation threads connect nearby nodes. Nodes drift and are
 * repelled by the cursor; picking a category draws its nodes along those threads into a loose, evenly
 * spaced ring (they gather but never pile up) and fades the rest. The filters and hint live inside the
 * field itself. Built on the site's glass + red-accent language.
 *
 * Progressive & cheap: server/no-JS/reduced-motion render a clean static grid of the same orbs; the
 * physics field only runs after mount, pauses off-screen (IntersectionObserver) and while the tab is
 * hidden, and skips cursor repulsion on touch devices.
 */
export function SkillNexus() {
  const t = useTranslations("skills");
  const { resolvedTheme } = useTheme();
  const fieldRef = useRef<HTMLDivElement>(null);
  const linkRef = useRef<HTMLCanvasElement>(null);
  const nodeEls = useRef<(HTMLLIElement | null)[]>([]);
  const mounted = useMounted();
  const reduced = useReducedMotion();
  const [filter, setFilter] = useState<"all" | SkillGroup["id"]>("all");
  const filterRef = useRef(filter);
  const lineColorRef = useRef("#141417");

  const labels = useMemo(
    () => flatSkills.map((s) => ({ ...s, label: t(`items.${s.id}`) })),
    [t],
  );

  useEffect(() => {
    filterRef.current = filter;
  }, [filter]);

  // Keep the thread colour in sync with the theme without restarting the physics.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const v = getComputedStyle(document.documentElement).getPropertyValue("--ink").trim();
    if (v) lineColorRef.current = v;
  }, [resolvedTheme, mounted]);

  const usePhysics = mounted && !reduced;

  // Physics loop — only when mounted, animation allowed, and the field is on screen.
  useEffect(() => {
    if (!usePhysics) return;
    const field = fieldRef.current;
    const canvas = linkRef.current;
    if (!field || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const coarse = window.matchMedia("(pointer: coarse)").matches;
    let dpr = 1;
    const measure = () => {
      const orb = nodeEls.current[0]?.querySelector<HTMLElement>(".orb");
      const d = orb?.offsetWidth || 88;
      const w = field.clientWidth;
      const h = field.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      return { w, h, d, r: d / 2 };
    };
    let { w, h, d, r } = measure();

    type P = { x: number; y: number; vx: number; vy: number };
    const pts: P[] = labels.map(() => ({
      x: r + Math.random() * Math.max(1, w - d),
      y: r + Math.random() * Math.max(1, h - d),
      vx: (Math.random() - 0.5) * 1.3,
      vy: (Math.random() - 0.5) * 1.3,
    }));

    const pointer = { x: -9999, y: -9999, active: false };
    const onMove = (e: PointerEvent) => {
      const rect = field.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
    };
    const onLeave = () => {
      pointer.active = false;
    };
    if (!coarse) {
      field.addEventListener("pointermove", onMove, { passive: true });
      field.addEventListener("pointerleave", onLeave);
    }

    const ro = new ResizeObserver(() => {
      ({ w, h, d, r } = measure());
    });
    ro.observe(field);

    let raf: number | null = null;
    let running = false;

    const tick = () => {
      const active = filterRef.current;

      // When a category is active, lay its nodes out on an evenly spaced ring around the centre, so
      // they gather along the threads but keep their distance instead of piling into one clump.
      const cx = w / 2;
      const cy = h * 0.54;
      const slotX = new Float64Array(pts.length);
      const slotY = new Float64Array(pts.length);
      const hasSlot = new Uint8Array(pts.length);
      if (active !== "all") {
        const matchIdx: number[] = [];
        for (let i = 0; i < labels.length; i++) if (labels[i].category === active) matchIdx.push(i);
        const n = matchIdx.length;
        const ringR = n <= 1 ? 0 : Math.min(Math.min(w, h) * 0.34, Math.max(d * 0.95, (n * (d * 1.4)) / (2 * Math.PI)));
        matchIdx.forEach((idx, k) => {
          const ang = (k / n) * Math.PI * 2 - Math.PI / 2;
          slotX[idx] = cx + Math.cos(ang) * ringR;
          slotY[idx] = cy + Math.sin(ang) * ringR;
          hasSlot[idx] = 1;
        });
      }

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        const el = nodeEls.current[i];
        if (!el) continue;

        if (active === "all") {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x - r < 0) { p.x = r; p.vx *= -1; }
          if (p.x + r > w) { p.x = w - r; p.vx *= -1; }
          if (p.y - r < 0) { p.y = r; p.vy *= -1; }
          if (p.y + r > h) { p.y = h - r; p.vy *= -1; }
          if (Math.abs(p.vx) < 0.18) p.vx += (Math.random() - 0.5) * 0.4;
          if (Math.abs(p.vy) < 0.18) p.vy += (Math.random() - 0.5) * 0.4;
          el.style.opacity = "1";
        } else if (hasSlot[i]) {
          // Ease toward this node's ring slot (attraction), then settle with friction.
          p.vx = (p.vx + (slotX[i] - p.x) * 0.05) * 0.84;
          p.vy = (p.vy + (slotY[i] - p.y) * 0.05) * 0.84;
          p.x += p.vx;
          p.y += p.vy;
          el.style.opacity = "1";
        } else {
          p.vx *= 0.9;
          p.vy *= 0.9;
          p.x += p.vx;
          p.y += p.vy;
          el.style.opacity = "0.07";
        }

        // Cursor repulsion (fine pointers only).
        if (pointer.active) {
          const dxm = p.x - pointer.x;
          const dym = p.y - pointer.y;
          const dist = Math.hypot(dxm, dym);
          const reach = 150;
          if (dist < reach && dist > 0.01) {
            const force = (reach - dist) / reach;
            p.vx += (dxm / dist) * force * 0.6;
            p.vy += (dym / dist) * force * 0.6;
          }
        }

        // Repulsion between visible neighbours so orbs never overlap.
        for (let j = i + 1; j < pts.length; j++) {
          if (active !== "all" && (labels[i].category !== active || labels[j].category !== active)) continue;
          const o = pts[j];
          const dx = p.x - o.x;
          const dy = p.y - o.y;
          const dist = Math.hypot(dx, dy) || 0.01;
          const min = d + 18;
          if (dist < min) {
            const push = ((min - dist) / dist) * 0.5;
            const fx = dx * push;
            const fy = dy * push;
            p.vx += fx; p.vy += fy;
            o.vx -= fx; o.vy -= fy;
          }
        }

        // Speed cap.
        const sp = Math.hypot(p.vx, p.vy);
        if (sp > 3.2) { p.vx = (p.vx / sp) * 3.2; p.vy = (p.vy / sp) * 3.2; }

        el.style.transform = `translate(${p.x - r}px, ${p.y - r}px)`;
      }

      // Constellation threads between visible nodes. Brighter overall, and much bolder for the focused
      // category — there every pair is linked into a web, so the selected group reads as one cluster.
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const focused = active !== "all";
      const linkDist = focused ? Math.hypot(w, h) : Math.max(160, d * 2.6);
      const alphaMul = focused ? 0.5 : 0.5;
      ctx.strokeStyle = lineColorRef.current;
      ctx.lineWidth = focused ? 1.2 : 1.3;
      for (let i = 0; i < pts.length; i++) {
        if (focused && labels[i].category !== active) continue;
        const a = pts[i];
        for (let j = i + 1; j < pts.length; j++) {
          if (focused && labels[j].category !== active) continue;
          const b = pts[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < linkDist) {
            ctx.globalAlpha = Math.min(0.45, (1 - dist / linkDist) * alphaMul);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;

      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running || document.hidden) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      if (raf !== null) { cancelAnimationFrame(raf); raf = null; }
    };

    // Run only while the field is in view.
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0 },
    );
    io.observe(field);

    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      field.removeEventListener("pointermove", onMove);
      field.removeEventListener("pointerleave", onLeave);
    };
  }, [usePhysics, labels]);

  const pill = (key: "all" | SkillGroup["id"], text: string) => {
    const on = filter === key;
    return (
      <button
        key={key}
        type="button"
        onClick={() => setFilter(key)}
        aria-pressed={on}
        className={`pointer-events-auto rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${on
          ? "bg-primary text-primary-foreground shadow-[0_6px_18px_-8px_var(--primary)]"
          : "text-ink-soft hover:bg-primary-soft hover:text-primary-soft-ink"
          }`}
      >
        {text}
      </button>
    );
  };

  return (
    <div
      ref={fieldRef}
      className="relative h-[clamp(520px,72vh,760px)] w-full overflow-hidden rounded-3xl shadow-[0_8px_28px_rgb(0_0_0/0.12)] [--orb:clamp(68px,9vw,92px)]"
      style={{
        background:
          "radial-gradient(120% 90% at 50% 0%, color-mix(in srgb, var(--primary) 7%, transparent), transparent 60%)",
      }}
    >
      {usePhysics && <canvas ref={linkRef} aria-hidden className="pointer-events-none absolute inset-0 z-0" />}

      {/* Category filters — inside the field, pinned to the top. */}
      <div
        className={
          usePhysics
            ? "pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-center p-3"
            : "relative z-20 flex justify-center p-3"
        }
      >
        <div className="pointer-events-auto flex max-w-full flex-wrap justify-center gap-1 rounded-full bg-surface/70 px-1.5 py-1.5 shadow-[0_4px_16px_rgb(0_0_0/0.14)] backdrop-blur-md">
          {pill("all", t("filterAll"))}
          {categories.map((c) => pill(c, t(`groups.${c}`)))}
        </div>
      </div>

      {/* The node field */}
      <ul
        aria-label={t("filterAll")}
        className={
          usePhysics
            ? "absolute inset-0 z-10 m-0 list-none p-0"
            : "relative z-10 flex flex-wrap items-start justify-center gap-x-6 gap-y-8 px-6 pb-12"
        }
      >
        {labels.map((s, i) => {
          const dimmed = filter !== "all" && s.category !== filter;
          return (
            <li
              key={s.id}
              ref={(el) => {
                nodeEls.current[i] = el;
              }}
              className={`group flex cursor-default flex-col items-center hover:z-30 ${usePhysics ? "absolute left-0 top-0 will-change-transform" : ""
                } ${!usePhysics && dimmed ? "opacity-20" : "opacity-100"} transition-opacity duration-500`}
              style={usePhysics ? { transform: "translate(-200px, -200px)" } : undefined}
            >
              <NodeOrb icon={s.icon} label={s.label} />
            </li>
          );
        })}
      </ul>

      {/* Hint — inside the field, centred along the bottom edge. */}
      <p
        className={
          usePhysics
            ? "pointer-events-none absolute inset-x-0 bottom-0 z-20 px-4 pb-3 text-center text-[11px] text-ink-faint"
            : "relative z-20 px-4 pb-3 text-center text-[11px] text-ink-faint"
        }
      >
        {t("nexusHint")}
      </p>
    </div>
  );
}
