"use client";

import { RotateCcw } from "lucide-react";
import { useTheme } from "next-themes";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useLocale } from "@/i18n/Providers";

type ColorGroup = 0 | 1 | 2 | 3; // 0: primary, 1: ink, 2: inkSoft, 3: primaryText

interface Particle {
  /** Target coordinates (assembled position) */
  tx: number;
  ty: number;
  /** Spawn coordinates (scattered constellation position) */
  sx: number;
  sy: number;
  /** Current rendered coordinates */
  x: number;
  y: number;
  /** Dynamic offset & velocity from cursor interaction */
  ox: number;
  oy: number;
  vx: number;
  vy: number;
  /** Visual radius */
  r: number;
  /** Theme color group */
  colorGroup: ColorGroup;
  /** Stagger delay in [0..0.45] */
  delay: number;
  /** Trajectory curve offset */
  swirl: number;
  /** Random oscillation phase */
  phase: number;
  /** Structural elements (bars, borders, dividers) stay visible as node frames */
  isStructural: boolean;
  /** Indices of structural neighbor particles for constellation filaments */
  n1: number;
  n2: number;
}

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
  /** Depth factor [0.25..1.0] for parallax & opacity */
  z: number;
  /** 0: primary accent, 1: ink, 2: inkSoft */
  colorGroup: 0 | 1 | 2;
  phase: number;
  pulseSpeed: number;
}

interface ThemeColors {
  primary: string;
  ink: string;
  inkSoft: string;
  primaryText: string;
}

function readThemeColors(): ThemeColors {
  if (typeof window === "undefined") {
    return {
      primary: "#dc2626",
      ink: "#141417",
      inkSoft: "#4a4a52",
      primaryText: "#b91c1c",
    };
  }
  const style = getComputedStyle(document.documentElement);
  return {
    primary: style.getPropertyValue("--primary").trim() || "#dc2626",
    ink: style.getPropertyValue("--ink").trim() || "#141417",
    inkSoft: style.getPropertyValue("--ink-soft").trim() || "#4a4a52",
    primaryText: style.getPropertyValue("--primary-text").trim() || "#b91c1c",
  };
}

/** Deterministic pseudo-random generator so particle scatter is stable */
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * NodeReconstruction
 *
 * 1. Renders a full-window (`fixed inset-0`) ambient constellation of drifting
 *    particles across the entire viewport width and height.
 * 2. Reconstructs the wrapped module from a scattered cloud of fine micro-nodes
 *    and constellation filaments into words, accent bars, boxes, and borders.
 * 3. After solidification, moving the cursor over any word or border opens a dynamic
 *    radial field where the DOM dissolves back into interactive, spring-physics nodes.
 */
export function NodeReconstruction({
  children,
  replayLabel = "Reconstruir nodos",
}: {
  children: ReactNode;
  replayLabel?: string;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ambientCanvasRef = useRef<HTMLCanvasElement>(null);

  const { resolvedTheme } = useTheme();
  const locale = useLocale();

  const [replayCount, setReplayCount] = useState(0);
  const [isAssembled, setIsAssembled] = useState(false);

  const particlesRef = useRef<Particle[]>([]);
  const colorsRef = useRef<ThemeColors>(readThemeColors());
  const sizeRef = useRef<{ width: number; height: number }>({ width: 0, height: 0 });
  const startTimeRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);
  const isSleepingRef = useRef<boolean>(false);

  const pointerRef = useRef<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    active: boolean;
    strength: number;
  }>({
    x: -9999,
    y: -9999,
    vx: 0,
    vy: 0,
    active: false,
    strength: 0,
  });

  const windowPointerRef = useRef<{
    x: number;
    y: number;
    active: boolean;
  }>({
    x: -9999,
    y: -9999,
    active: false,
  });

  /** Full-viewport ambient drifting particles */
  useEffect(() => {
    const ambientCanvas = ambientCanvasRef.current;
    if (!ambientCanvas) return;

    let vw = window.innerWidth;
    let vh = window.innerHeight;
    let ambientRaf: number | null = null;
    const ambientParticles: AmbientParticle[] = [];

    const setupAmbientCanvas = () => {
      vw = window.innerWidth;
      vh = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      ambientCanvas.width = Math.round(vw * dpr);
      ambientCanvas.height = Math.round(vh * dpr);
      ambientCanvas.style.width = `${vw}px`;
      ambientCanvas.style.height = `${vh}px`;

      // Target ~130 particles on a 1920x1080 screen, clamped between 70 and 170
      const targetCount = Math.max(
        70,
        Math.min(170, Math.round((vw * vh) / 14500)),
      );

      ambientParticles.length = 0;
      let seed = 101;
      for (let i = 0; i < targetCount; i++) {
        const r1 = seededRandom(seed++);
        const r2 = seededRandom(seed++);
        const r3 = seededRandom(seed++);
        const r4 = seededRandom(seed++);
        const r5 = seededRandom(seed++);
        const r6 = seededRandom(seed++);

        const z = 0.25 + r3 * 0.75; // depth layer
        const angle = r4 * Math.PI * 2;
        const speed = (0.14 + r5 * 0.34) * (0.45 + z * 0.65);

        // ~32% primary accent particles, ~40% ink, ~28% inkSoft
        const colorGroup: 0 | 1 | 2 = r6 < 0.32 ? 0 : r6 < 0.72 ? 1 : 2;

        ambientParticles.push({
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

    setupAmbientCanvas();

    const handleWindowPointerMove = (e: PointerEvent) => {
      windowPointerRef.current.x = e.clientX;
      windowPointerRef.current.y = e.clientY;
      windowPointerRef.current.active = true;
    };

    const handleWindowPointerLeave = () => {
      windowPointerRef.current.active = false;
    };

    const handleWindowResize = () => {
      setupAmbientCanvas();
    };

    window.addEventListener("pointermove", handleWindowPointerMove, { passive: true });
    window.addEventListener("pointerleave", handleWindowPointerLeave);
    window.addEventListener("resize", handleWindowResize);

    const renderAmbient = (now: number) => {
      const ctx = ambientCanvas.getContext("2d");
      if (!ctx) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, vw, vh);

      const colors = colorsRef.current;
      const palette = [colors.primary, colors.ink, colors.inkSoft];
      const wPtr = windowPointerRef.current;
      const repelRadius = 135;
      const repelRadiusSq = repelRadius * repelRadius;

      // 1. Update positions & gentle breeze repulsion
      const count = ambientParticles.length;
      for (let i = 0; i < count; i++) {
        const p = ambientParticles[i];

        // Organic harmonic drift
        const wave = Math.sin(now * p.pulseSpeed + p.phase) * 0.12;
        p.x += p.vx + wave;
        p.y += p.vy - wave * 0.7;

        // Toroidal wrap around viewport edges so distribution stays even
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

      // 2. Draw subtle constellation threads between nearby ambient particles
      const maxConnectDist = 105;
      const maxConnectDistSq = maxConnectDist * maxConnectDist;
      ctx.lineWidth = 0.55;
      ctx.strokeStyle = colors.primary;
      ctx.globalAlpha = 0.20;
      ctx.beginPath();
      let hasAmbientLines = false;

      for (let i = 0; i < count; i++) {
        const a = ambientParticles[i];
        const ax = a.x + a.ox;
        const ay = a.y + a.oy;

        for (let j = i + 1; j < count; j++) {
          const b = ambientParticles[j];
          const dx = ax - (b.x + b.ox);
          const dy = ay - (b.y + b.oy);
          const dSq = dx * dx + dy * dy;
          if (dSq < maxConnectDistSq) {
            ctx.moveTo(ax, ay);
            ctx.lineTo(b.x + b.ox, b.y + b.oy);
            hasAmbientLines = true;
          }
        }
      }
      if (hasAmbientLines) {
        ctx.stroke();
      }

      // 3. Draw ambient particles grouped by color and depth tier
      for (let group = 0; group < 3; group++) {
        ctx.fillStyle = palette[group];

        // Far/Mid layer (subtle atmospheric dust)
        ctx.globalAlpha = group === 0 ? 0.64 : 0.66;
        ctx.beginPath();
        for (let i = 0; i < count; i++) {
          const p = ambientParticles[i];
          if (p.colorGroup !== group || p.z >= 0.72) continue;
          const rx = p.x + p.ox;
          const ry = p.y + p.oy;
          ctx.moveTo(rx + p.r, ry);
          ctx.arc(rx, ry, p.r, 0, Math.PI * 2);
        }
        ctx.fill();

        // Foreground ambient layer (slightly brighter nodes)
        ctx.globalAlpha = group === 0 ? 0.68 : 0.66;
        ctx.beginPath();
        for (let i = 0; i < count; i++) {
          const p = ambientParticles[i];
          if (p.colorGroup !== group || p.z < 0.72) continue;
          const rx = p.x + p.ox;
          const ry = p.y + p.oy;
          const pulseR =
            p.r * (0.9 + Math.sin(now * p.pulseSpeed * 1.6 + p.phase) * 0.18);
          ctx.moveTo(rx + pulseR, ry);
          ctx.arc(rx, ry, pulseR, 0, Math.PI * 2);
        }
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      ambientRaf = requestAnimationFrame(renderAmbient);
    };

    ambientRaf = requestAnimationFrame(renderAmbient);

    return () => {
      window.removeEventListener("pointermove", handleWindowPointerMove);
      window.removeEventListener("pointerleave", handleWindowPointerLeave);
      window.removeEventListener("resize", handleWindowResize);
      if (ambientRaf !== null) {
        cancelAnimationFrame(ambientRaf);
      }
    };
  }, []);

  /** Samples the rendered DOM inside `contentRef` into target particle coordinates */
  const sampleDOMIntoParticles = useCallback(() => {
    const contentEl = contentRef.current;
    const canvasEl = canvasRef.current;
    if (!contentEl || !canvasEl) return;

    const rect = contentEl.getBoundingClientRect();
    const width = Math.max(1, Math.round(rect.width));
    const height = Math.max(1, Math.round(rect.height));
    sizeRef.current = { width, height };

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvasEl.width = Math.round(width * dpr);
    canvasEl.height = Math.round(height * dpr);
    canvasEl.style.width = `${width}px`;
    canvasEl.style.height = `${height}px`;

    colorsRef.current = readThemeColors();

    const particles: Particle[] = [];
    let seedCounter = 1;

    const createParticle = (
      tx: number,
      ty: number,
      r: number,
      colorGroup: ColorGroup,
      isStructural: boolean,
      n1 = -1,
      n2 = -1,
    ): number => {
      const idx = particles.length;
      const r1 = seededRandom(seedCounter++);
      const r2 = seededRandom(seedCounter++);
      const r3 = seededRandom(seedCounter++);
      const r4 = seededRandom(seedCounter++);

      // Distribute initial positions across the whole module viewport like a starry constellation
      const spreadX = (r1 - 0.5) * width * 0.95;
      const spreadY = (r2 - 0.5) * height * 0.95;
      const sx = Math.max(12, Math.min(width - 12, tx * 0.35 + width * 0.325 + spreadX));
      const sy = Math.max(12, Math.min(height - 12, ty * 0.35 + height * 0.325 + spreadY));

      const normX = Math.max(0, Math.min(1, tx / Math.max(1, width)));
      const normY = Math.max(0, Math.min(1, ty / Math.max(1, height)));
      const delay = normX * 0.16 + normY * 0.24 + r3 * 0.06;

      particles.push({
        tx,
        ty,
        sx,
        sy,
        x: sx,
        y: sy,
        ox: 0,
        oy: 0,
        vx: 0,
        vy: 0,
        r,
        colorGroup,
        delay,
        swirl: (r4 - 0.5) * 44,
        phase: r1 * Math.PI * 2,
        isStructural,
        n1,
        n2,
      });
      return idx;
    };

    // 1. Sample Top Accent Bars (`[data-node-bar]` or heading primary bars)
    const bars = contentEl.querySelectorAll<HTMLElement>(
      "[data-node-bar], h1 > span.bg-primary, h2 > span.bg-primary",
    );
    bars.forEach((bar) => {
      const bRect = bar.getBoundingClientRect();
      const bx = bRect.left - rect.left;
      const by = bRect.top - rect.top;
      const bw = bRect.width;
      const bh = bRect.height;
      if (bw <= 0 || bh <= 0) return;

      const stepX = 3;
      const stepY = Math.max(2, bh / 2);
      const cols = Math.max(2, Math.floor(bw / stepX));
      const rows = Math.max(2, Math.round(bh / stepY));
      const prevRow: number[] = [];

      for (let r = 0; r <= rows; r++) {
        let prevInRow = -1;
        const py = by + Math.min(bh, r * stepY);
        for (let c = 0; c <= cols; c++) {
          const px = bx + Math.min(bw, c * stepX);
          const n1 = prevInRow;
          const n2 = prevRow[c] ?? -1;
          const isCorner = (r === 0 || r === rows) && (c === 0 || c === cols);
          const idx = createParticle(
            px,
            py,
            isCorner ? 1.7 : 1.3,
            0,
            true,
            n1,
            n2,
          );
          prevInRow = idx;
          prevRow[c] = idx;
        }
      }
    });

    // 2. Sample Structural Boxes / Recuadros (`[data-node-box]`)
    const boxes = contentEl.querySelectorAll<HTMLElement>("[data-node-box]");
    boxes.forEach((box) => {
      const bRect = box.getBoundingClientRect();
      const bx = bRect.left - rect.left;
      const by = bRect.top - rect.top;
      const bw = bRect.width;
      const bh = bRect.height;
      if (bw <= 0 || bh <= 0) return;

      const radius = Math.min(16, bw * 0.1, bh * 0.1);
      const perimeterPoints: Array<{ x: number; y: number; corner?: boolean }> = [];
      const step = 4.5;

      // Top edge
      for (let x = bx + radius; x <= bx + bw - radius; x += step) {
        perimeterPoints.push({ x, y: by });
      }
      // Top-right corner arc
      const arcSteps = 5;
      for (let i = 0; i <= arcSteps; i++) {
        const a = -Math.PI / 2 + (i / arcSteps) * (Math.PI / 2);
        perimeterPoints.push({
          x: bx + bw - radius + Math.cos(a) * radius,
          y: by + radius + Math.sin(a) * radius,
          corner: i === Math.floor(arcSteps / 2),
        });
      }
      // Right edge
      for (let y = by + radius; y <= by + bh - radius; y += step) {
        perimeterPoints.push({ x: bx + bw, y });
      }
      // Bottom-right corner arc
      for (let i = 0; i <= arcSteps; i++) {
        const a = (i / arcSteps) * (Math.PI / 2);
        perimeterPoints.push({
          x: bx + bw - radius + Math.cos(a) * radius,
          y: by + bh - radius + Math.sin(a) * radius,
          corner: i === Math.floor(arcSteps / 2),
        });
      }
      // Bottom edge
      for (let x = bx + bw - radius; x >= bx + radius; x -= step) {
        perimeterPoints.push({ x, y: by + bh });
      }
      // Bottom-left corner arc
      for (let i = 0; i <= arcSteps; i++) {
        const a = Math.PI / 2 + (i / arcSteps) * (Math.PI / 2);
        perimeterPoints.push({
          x: bx + radius + Math.cos(a) * radius,
          y: by + bh - radius + Math.sin(a) * radius,
          corner: i === Math.floor(arcSteps / 2),
        });
      }
      // Left edge
      for (let y = by + bh - radius; y >= by + radius; y -= step) {
        perimeterPoints.push({ x: bx, y });
      }
      // Top-left corner arc
      for (let i = 0; i <= arcSteps; i++) {
        const a = Math.PI + (i / arcSteps) * (Math.PI / 2);
        perimeterPoints.push({
          x: bx + radius + Math.cos(a) * radius,
          y: by + radius + Math.sin(a) * radius,
          corner: i === Math.floor(arcSteps / 2),
        });
      }

      let firstIdx = -1;
      let prevIdx = -1;
      const outerIndices: number[] = [];

      perimeterPoints.forEach((pt, i) => {
        const idx = createParticle(
          pt.x,
          pt.y,
          pt.corner ? 2.1 : 1.3,
          0,
          true,
          prevIdx,
          -1,
        );
        if (i === 0) firstIdx = idx;
        prevIdx = idx;
        outerIndices.push(idx);
      });

      if (firstIdx !== -1 && prevIdx !== -1 && firstIdx !== prevIdx) {
        particles[firstIdx].n1 = prevIdx;
      }

      // Subtle inner structural truss nodes every 4th perimeter point
      let prevInnerIdx = -1;
      const cx = bx + bw / 2;
      const cy = by + bh / 2;
      for (let i = 0; i < perimeterPoints.length; i += 4) {
        const pt = perimeterPoints[i];
        const dx = cx - pt.x;
        const dy = cy - pt.y;
        const len = Math.hypot(dx, dy) || 1;
        const ix = pt.x + (dx / len) * 4.5;
        const iy = pt.y + (dy / len) * 4.5;
        const idx = createParticle(
          ix,
          iy,
          0.95,
          0,
          true,
          prevInnerIdx,
          outerIndices[i] ?? -1,
        );
        prevInnerIdx = idx;
      }
    });

    // 3. Sample Structural Divider Lines (`[data-node-line]`)
    const lines = contentEl.querySelectorAll<HTMLElement>("[data-node-line]");
    lines.forEach((line) => {
      const lRect = line.getBoundingClientRect();
      const lx = lRect.left - rect.left;
      const ly = lRect.top - rect.top;
      const lw = lRect.width;
      const lh = lRect.height;
      if (lw <= 0 && lh <= 0) return;

      const step = 5;
      let prevIdx = -1;
      if (lw >= lh) {
        const y = ly + lh / 2;
        const count = Math.max(2, Math.floor(lw / step));
        for (let i = 0; i <= count; i++) {
          const x = lx + (i / count) * lw;
          const isEnd = i === 0 || i === count;
          const idx = createParticle(x, y, isEnd ? 1.85 : 1.1, 0, true, prevIdx, -1);
          prevIdx = idx;
        }
      } else {
        const x = lx + lw / 2;
        const count = Math.max(2, Math.floor(lh / step));
        for (let i = 0; i <= count; i++) {
          const y = ly + (i / count) * lh;
          const isEnd = i === 0 || i === count;
          const idx = createParticle(x, y, isEnd ? 1.85 : 1.1, 0, true, prevIdx, -1);
          prevIdx = idx;
        }
      }
    });

    // 4. Sample Typography (Headings, Lead, Paragraphs, Facts) via Offscreen Canvas + DOM Range
    const offCanvas = document.createElement("canvas");
    offCanvas.width = width;
    offCanvas.height = height;
    const offCtx = offCanvas.getContext("2d", { willReadFrequently: true });

    if (offCtx) {
      const textElements = contentEl.querySelectorAll<HTMLElement>(
        "h1, h2, h3, p, dt, dd, [data-node-text]",
      );
      const range = document.createRange();

      textElements.forEach((el) => {
        const elRect = el.getBoundingClientRect();
        if (elRect.width <= 0 || elRect.height <= 0) return;

        const tag = el.tagName.toLowerCase();
        const role = el.dataset.nodeText || tag;
        const computed = window.getComputedStyle(el);

        let step = 2.4;
        let radius = 1.05;
        let colorGroup: ColorGroup = 1;
        let isStructural = false;

        if (tag === "h1" || tag === "h2" || role === "heading") {
          step = 2.0;
          radius = 1.42;
          colorGroup = 1;
          isStructural = true;
        } else if (role === "lead") {
          step = 2.25;
          radius = 1.18;
          colorGroup = 1;
        } else if (tag === "dt" || role === "term") {
          step = 2.0;
          radius = 1.08;
          colorGroup = 3;
        } else if (tag === "dd" || role === "value") {
          step = 2.15;
          radius = 1.14;
          colorGroup = 1;
        } else {
          step = 2.45;
          radius = 1.02;
          colorGroup = 1;
        }

        const pad = 8;
        const minX = Math.max(0, Math.floor(elRect.left - rect.left - pad));
        const minY = Math.max(0, Math.floor(elRect.top - rect.top - pad));
        const maxX = Math.min(width, Math.ceil(elRect.right - rect.left + pad));
        const maxY = Math.min(height, Math.ceil(elRect.bottom - rect.top + pad));
        const boxW = maxX - minX;
        const boxH = maxY - minY;
        if (boxW <= 0 || boxH <= 0) return;

        offCtx.clearRect(minX, minY, boxW, boxH);
        offCtx.font = `${computed.fontStyle} ${computed.fontWeight} ${computed.fontSize} ${computed.fontFamily}`;
        offCtx.textBaseline = "alphabetic";
        offCtx.fillStyle = "#ffffff";
        if ("letterSpacing" in offCtx && computed.letterSpacing) {
          (offCtx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing =
            computed.letterSpacing;
        }

        const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        let textNode = walker.nextNode() as Text | null;
        while (textNode) {
          const content = textNode.textContent || "";
          const wordRegex = /\S+/g;
          let match = wordRegex.exec(content);
          while (match !== null) {
            const word = match[0];
            range.setStart(textNode, match.index);
            range.setEnd(textNode, match.index + word.length);
            const wRect = range.getBoundingClientRect();

            if (wRect.width > 0 && wRect.height > 0) {
              const metrics = offCtx.measureText(word);
              const ascent =
                metrics.fontBoundingBoxAscent ??
                metrics.actualBoundingBoxAscent ??
                wRect.height * 0.78;
              const wx = wRect.left - rect.left;
              const wy = wRect.top - rect.top + ascent;
              offCtx.fillText(word, wx, wy);
            }
            match = wordRegex.exec(content);
          }
          textNode = walker.nextNode() as Text | null;
        }

        const imgData = offCtx.getImageData(minX, minY, boxW, boxH).data;
        const cols = Math.ceil(boxW / step);
        const prevRowCols = new Int32Array(cols + 2).fill(-1);

        for (let y = 0; y < boxH; y += step) {
          const iy = Math.floor(y);
          let prevInRow = -1;
          let prevCol = -99;

          for (let x = 0; x < boxW; x += step) {
            const ix = Math.floor(x);
            const col = Math.floor(x / step);
            const alpha = imgData[(iy * boxW + ix) * 4 + 3];

            if (alpha > 95) {
              const px = minX + x;
              const py = minY + y;
              const n1 = col - prevCol <= 2 ? prevInRow : -1;
              const n2 =
                prevRowCols[col] !== -1
                  ? prevRowCols[col]
                  : col > 0 && prevRowCols[col - 1] !== -1
                    ? prevRowCols[col - 1]
                    : -1;

              const idx = createParticle(
                px,
                py,
                radius,
                colorGroup,
                isStructural,
                n1,
                n2,
              );
              prevInRow = idx;
              prevCol = col;
              prevRowCols[col] = idx;
            } else {
              prevRowCols[col] = -1;
            }
          }
        }
      });
    }

    particlesRef.current = particles;
  }, []);

  /** Starts or restarts the animation loop */
  const startAnimationLoop = useCallback((resetStartTime = false) => {
    if (resetStartTime) {
      startTimeRef.current = performance.now();
      setIsAssembled(false);
      // Reset particle positions to their scattered constellation spawn points
      const pts = particlesRef.current;
      for (let i = 0; i < pts.length; i++) {
        pts[i].x = pts[i].sx;
        pts[i].y = pts[i].sy;
        pts[i].ox = 0;
        pts[i].oy = 0;
        pts[i].vx = 0;
        pts[i].vy = 0;
      }
    }

    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    isSleepingRef.current = false;

    const tick = (now: number) => {
      const canvasEl = canvasRef.current;
      const contentEl = contentRef.current;
      if (!canvasEl || !contentEl) return;

      const ctx = canvasEl.getContext("2d");
      if (!ctx) return;

      const { width, height } = sizeRef.current;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      const elapsed = now - startTimeRef.current;
      const pts = particlesRef.current;
      const colors = colorsRef.current;
      const ptr = pointerRef.current;

      // Smoothly update pointer strength
      const targetStrength = ptr.active ? 1 : 0;
      ptr.strength += (targetStrength - ptr.strength) * 0.14;
      if (ptr.strength < 0.002 && !ptr.active) ptr.strength = 0;

      // Overall DOM solidification progress (starts fading in at 1550ms, complete by 2250ms)
      const domProgress = Math.max(0, Math.min(1, (elapsed - 1550) / 700));
      const smoothDomOpacity = domProgress * domProgress * (3 - 2 * domProgress);

      if (domProgress >= 1) {
        setIsAssembled((prev) => (prev ? prev : true));
      }

      // Apply DOM opacity & dynamic radial cursor dissolve mask
      contentEl.style.opacity = `${smoothDomOpacity}`;
      if (smoothDomOpacity > 0.05 && ptr.strength > 0.01) {
        const maskR = Math.round(115 * ptr.strength);
        const innerR = Math.round(maskR * 0.52);
        const maskValue = `radial-gradient(circle ${maskR}px at ${Math.round(ptr.x)}px ${Math.round(ptr.y)}px, transparent 0px, transparent ${innerR}px, rgba(0,0,0,0.45) ${Math.round(maskR * 0.78)}px, black ${maskR}px)`;
        contentEl.style.maskImage = maskValue;
        contentEl.style.webkitMaskImage = maskValue;
      } else {
        contentEl.style.maskImage = "none";
        contentEl.style.webkitMaskImage = "none";
      }

      const cursorRadius = 110;
      const cursorRadiusSq = cursorRadius * cursorRadius;
      let maxDisplacement = 0;

      // 1. Update all particle physics & positions
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        const localTime = elapsed - 220 - p.delay * 820;
        const duration = 1280;

        let baseX: number;
        let baseY: number;

        if (localTime <= 0) {
          const floatAngle = now * 0.0022 + p.phase;
          baseX = p.sx + Math.cos(floatAngle) * 7;
          baseY = p.sy + Math.sin(floatAngle) * 7;
        } else if (localTime >= duration) {
          baseX = p.tx;
          baseY = p.ty;
        } else {
          const t = localTime / duration;
          const ease = 1 - Math.pow(1 - t, 4);
          const arc = Math.sin(t * Math.PI) * p.swirl * (1 - ease);
          baseX = p.sx + (p.tx - p.sx) * ease + arc;
          baseY = p.sy + (p.ty - p.sy) * ease - arc * 0.55;
        }

        // Cursor magnetic repulsion
        if (ptr.strength > 0.01) {
          const curX = baseX + p.ox;
          const curY = baseY + p.oy;
          const dx = curX - ptr.x;
          const dy = curY - ptr.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < cursorRadiusSq && distSq > 0.001) {
            const dist = Math.sqrt(distSq);
            const falloff = Math.pow(1 - dist / cursorRadius, 2) * ptr.strength;
            const push = falloff * 3.6;
            p.vx += (dx / dist) * push + ptr.vx * falloff * 0.08;
            p.vy += (dy / dist) * push + ptr.vy * falloff * 0.08;
          }
        }

        // Elastic spring back to 0 offset
        p.vx += -p.ox * 0.13;
        p.vy += -p.oy * 0.13;
        p.vx *= 0.8;
        p.vy *= 0.8;
        p.ox += p.vx;
        p.oy += p.vy;

        const disp = Math.abs(p.ox) + Math.abs(p.oy);
        if (disp > maxDisplacement) maxDisplacement = disp;

        p.x = baseX + p.ox;
        p.y = baseY + p.oy;
      }

      // Decay pointer velocity
      ptr.vx *= 0.85;
      ptr.vy *= 0.85;

      // 2. Render Constellation / Plexus Connections
      const isAssembling = elapsed < 2350;
      const paletteStrings = [
        colors.primary,
        colors.ink,
        colors.inkSoft,
        colors.primaryText,
      ];

      ctx.lineWidth = 0.65;

      // Draw structural & active filaments grouped by primary vs ink
      for (let group = 0; group < 4; group++) {
        ctx.strokeStyle = paletteStrings[group];
        ctx.globalAlpha = isAssembling ? 0.28 : 0.22;
        ctx.beginPath();
        let hasLines = false;

        for (let i = 0; i < pts.length; i++) {
          const p = pts[i];
          if (p.colorGroup !== group) continue;

          const disp = Math.abs(p.ox) + Math.abs(p.oy);
          const nearCursor =
            ptr.strength > 0.02 &&
            (p.tx - ptr.x) * (p.tx - ptr.x) + (p.ty - ptr.y) * (p.ty - ptr.y) <
            cursorRadiusSq * 1.25;

          const shouldDrawLinks =
            isAssembling || (p.isStructural && group === 0) || disp > 0.45 || nearCursor;

          if (!shouldDrawLinks) continue;

          const maxLinkDistSq = isAssembling || nearCursor || disp > 0.45 ? 1764 : 196; // 42px vs 14px

          if (p.n1 !== -1) {
            const nb = pts[p.n1];
            const dx = p.x - nb.x;
            const dy = p.y - nb.y;
            if (dx * dx + dy * dy <= maxLinkDistSq) {
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(nb.x, nb.y);
              hasLines = true;
            }
          }
          if (p.n2 !== -1 && (isAssembling || nearCursor || disp > 0.6)) {
            const nb = pts[p.n2];
            const dx = p.x - nb.x;
            const dy = p.y - nb.y;
            if (dx * dx + dy * dy <= maxLinkDistSq) {
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(nb.x, nb.y);
              hasLines = true;
            }
          }
        }

        if (hasLines) {
          ctx.stroke();
        }
      }

      // 3. Render Fine Micro-Nodes (Particles)
      // Batched into two alpha tiers: full-intensity active nodes and subtle resting structural nodes
      for (let group = 0; group < 4; group++) {
        ctx.fillStyle = paletteStrings[group];

        // Tier A: High-intensity particles (during assembly, structural borders/bars, or inside cursor field)
        ctx.globalAlpha = 0.92;
        ctx.beginPath();
        let hasHigh = false;

        // Tier B: Mid-intensity transition particles (feather edge of cursor mask or solidification)
        const midParticles: Particle[] = [];

        for (let i = 0; i < pts.length; i++) {
          const p = pts[i];
          if (p.colorGroup !== group) continue;

          // Compute particle visibility relative to DOM solidification & cursor window
          let alphaTier: "high" | "mid" | "none" = "high";

          if (smoothDomOpacity > 0.05) {
            const disp = Math.abs(p.ox) + Math.abs(p.oy);
            const dx = p.tx - ptr.x;
            const dy = p.ty - ptr.y;
            const distSq = dx * dx + dy * dy;
            const maskR = 115 * ptr.strength;

            if (disp > 0.6 || (ptr.strength > 0.02 && distSq < maskR * maskR * 0.55)) {
              alphaTier = "high";
            } else if (ptr.strength > 0.02 && distSq < maskR * maskR * 1.15) {
              alphaTier = "mid";
            } else if (p.isStructural && group === 0) {
              // Primary bars, recuadro borders, and divider nodes stay visible!
              alphaTier = "high";
            } else if (smoothDomOpacity < 0.98) {
              alphaTier = "mid";
            } else {
              // Handed off cleanly to crisp DOM typography until cursor approaches
              alphaTier = "none";
            }
          }

          if (alphaTier === "high") {
            ctx.moveTo(p.x + p.r, p.y);
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            hasHigh = true;
          } else if (alphaTier === "mid") {
            midParticles.push(p);
          }
        }

        if (hasHigh) {
          ctx.fill();
        }

        if (midParticles.length > 0) {
          ctx.globalAlpha = Math.max(0.28, 1 - smoothDomOpacity * 0.72);
          ctx.beginPath();
          for (let j = 0; j < midParticles.length; j++) {
            const p = midParticles[j];
            ctx.moveTo(p.x + p.r, p.y);
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          }
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;

      // Sleep the loop when assembly is finished and no cursor interaction is active
      if (
        elapsed > 2600 &&
        !ptr.active &&
        ptr.strength === 0 &&
        maxDisplacement < 0.08
      ) {
        isSleepingRef.current = true;
        rafRef.current = null;
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  /** Initial setup and re-sampling on locale/replay changes */
  useEffect(() => {
    let cancelled = false;
    let resizeTimer: ReturnType<typeof setTimeout> | null = null;

    const init = async () => {
      if (typeof document !== "undefined" && "fonts" in document) {
        try {
          await document.fonts.ready;
        } catch {
          // continue if fonts API rejects
        }
      }
      if (cancelled) return;

      requestAnimationFrame(() => {
        if (cancelled) return;
        sampleDOMIntoParticles();
        startAnimationLoop(true);
      });
    };

    init();

    const handleResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (cancelled) return;
        sampleDOMIntoParticles();
        startAnimationLoop(false);
      }, 150);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      cancelled = true;
      if (resizeTimer) clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [locale, replayCount, sampleDOMIntoParticles, startAnimationLoop]);

  /** Theme change listener: updates particle colors immediately without losing state */
  useEffect(() => {
    const timer = setTimeout(() => {
      colorsRef.current = readThemeColors();
      if (isSleepingRef.current) {
        startAnimationLoop(false);
      }
    }, 30);
    return () => clearTimeout(timer);
  }, [resolvedTheme, startAnimationLoop]);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const contentEl = contentRef.current;
      if (!contentEl) return;
      const rect = contentEl.getBoundingClientRect();
      const nx = e.clientX - rect.left;
      const ny = e.clientY - rect.top;

      const ptr = pointerRef.current;
      if (ptr.active) {
        ptr.vx = Math.max(-24, Math.min(24, nx - ptr.x));
        ptr.vy = Math.max(-24, Math.min(24, ny - ptr.y));
      }
      ptr.x = nx;
      ptr.y = ny;
      ptr.active = true;

      if (isSleepingRef.current) {
        startAnimationLoop(false);
      }
    },
    [startAnimationLoop],
  );

  const handlePointerLeave = useCallback(() => {
    pointerRef.current.active = false;
    if (isSleepingRef.current) {
      startAnimationLoop(false);
    }
  }, [startAnimationLoop]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const contentEl = contentRef.current;
      if (!contentEl) return;
      const rect = contentEl.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      const pts = particlesRef.current;
      const pulseRadius = 150;
      const pulseRadiusSq = pulseRadius * pulseRadius;

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        const dx = p.x - cx;
        const dy = p.y - cy;
        const distSq = dx * dx + dy * dy;
        if (distSq < pulseRadiusSq && distSq > 0.01) {
          const dist = Math.sqrt(distSq);
          const force = Math.pow(1 - dist / pulseRadius, 1.5) * 9;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }
      }

      if (isSleepingRef.current) {
        startAnimationLoop(false);
      }
    },
    [startAnimationLoop],
  );

  return (
    <>
      {/* Full-window Ambient Constellation Background (100vw x 100vh) */}
      <canvas
        ref={ambientCanvasRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
      />

      <div
        ref={wrapperRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onPointerDown={handlePointerDown}
        className="relative z-10 select-text"
      >
        {/* Replay button to test / re-trigger the node assembly anytime */}
        <div className="mb-4 flex justify-end">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setReplayCount((c) => c + 1);
            }}
            className={`inline-flex cursor-pointer items-center gap-2 rounded-full border border-primary/30 bg-surface/80 px-3.5 py-1.5 font-mono text-xs text-ink-soft backdrop-blur-xs transition-all duration-300 hover:border-primary hover:text-primary ${isAssembled ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            title={replayLabel}
          >
            <RotateCcw className="size-3.5" aria-hidden />
            <span>{replayLabel}</span>
          </button>
        </div>

        <div className="relative">
          {/* Real accessible DOM layer (fades in as nodes lock into place) */}
          <div
            ref={contentRef}
            style={{ opacity: 0 }}
            className="transition-none will-change-[opacity]"
          >
            {children}
          </div>

          {/* Interactive Particle & Constellation Canvas Overlay */}
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-20"
          />
        </div>
      </div>
    </>
  );
}
