// The module drum below the hero (promt-guide-cards.md): landscape cards on a vertical cylinder, driven by page scroll.
// Every tuning value lives here.

export const DRUM = {
  /** CSS perspective of the scene, px (guide). */
  perspective: 1350,
  /** Page scroll per card, in vh. The section is (cards - 1) × this + one screen tall. */
  scrollPerCard: { desktop: 90, mobile: 55 },
  /** Magnetic dwell: higher holds each card longer at rest before moving on (guide: 4.2). */
  dwellPower: 4.2,
  /** px between the focused card and its neighbour. */
  gap: 36,
  /** px by which the edge card at offset 2 runs past the drum's edge (guide: 55). */
  edgeOverflow: 55,
  /** Opacity of every card that is not focused. */
  dimOpacity: 0.4,
  /** Cards further than this from the focused one fade out over the next unit (fewer neighbours on phones). */
  fadeFrom: { desktop: 2, mobile: 1 },
  /** Turn of the whole drum around Z, deg (guide: -3). */
  roll: -3,
};

/** Idle wave of the focused card while the visitor neither scrolls nor hovers. */
export const WAVE = {
  /** px of vertical float. */
  amplitude: 6,
  /** deg of tilt around X at the top of the float. */
  tilt: 2.5,
  /** s per full wave. */
  period: 5,
  /** s to blend the wave in or out. */
  blend: 0.9,
  /** s without scrolling before the card counts as idle. */
  idleAfter: 0.35,
};

const easeOutCubic = (p: number) => 1 - (1 - p) ** 3;

/** The hero's shattered glass, tuned for a card on hover: slower, softer, pieces staying close together. */
export const CARD_GLASS = {
  /** s each piece takes to move. Hero: 0.72. */
  fly: 1.5,
  /** s between pieces. Hero: 0.03. */
  stagger: 0.06,
  /** Share of the hero's displacement (1 = hero). */
  spread: 0.12,
  /** Pieces stay opaque instead of fading as they fly. */
  fade: false,
  /** Share of the hero's tilt toward the pointer. */
  tilt: 0.35,
  /** Easing of the break (0 → 1) and of the return (0 → 1). Hero: cubic in, back-out. */
  outEase: easeOutCubic,
  inEase: easeOutCubic,
};

export const smoothstep = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Continuous card index with the guide's magnetic dwell: it rests on each whole index, then hurries to the next. */
export function dwell(raw: number, power = DRUM.dwellPower) {
  const r = Math.round(raw);
  const d = raw - r; // [-0.5, 0.5]
  return r + (Math.sign(d) * Math.abs(d * 2) ** power) / 2;
}

// Key poses at offsets 0, 1, 2 and 3 from the focused card (guide): depth (px) and turn around X (deg).
const Z = [400, 220, -60, -250];
const ROT = [0, 132, 175, 195];

/**
 * Where a card sits at `offset` from the focused one, on a drum `h` px tall with cards `cardH` px tall.
 * Positive offsets (the cards still to come) sit below. Smoothstep between the guide's key poses; the outer
 * positions are solved through the perspective so the card at 2 just runs past the edge and the one at 3 is out.
 */
export function drumPose(offset: number, h: number, cardH: number) {
  const a = Math.min(Math.abs(offset), 3);
  const s = Math.sign(offset);
  const seg = Math.min(Math.floor(a), 2);
  const t = smoothstep(a - seg);
  const scale = (z: number) => DRUM.perspective / (DRUM.perspective - z);
  const y1 = cardH + DRUM.gap;
  const y2 = Math.max(y1 + cardH * 0.25, (h / 2 + DRUM.edgeOverflow) / scale(Z[2]) - cardH / 2);
  const y3 = (h / 2 + 100) / scale(Z[3]) + cardH / 2;
  const Y = [0, y1, y2, y3];
  return { y: s * lerp(Y[seg], Y[seg + 1], t), z: lerp(Z[seg], Z[seg + 1], t), rot: s * lerp(ROT[seg], ROT[seg + 1], t) };
}

/** Opacity at `offset`: full when focused, dimmed beside it, fading out past `fadeFrom`. */
export function drumOpacity(offset: number, fadeFrom: number) {
  const a = Math.abs(offset);
  if (a <= 1) return lerp(1, DRUM.dimOpacity, a);
  return DRUM.dimOpacity * (1 - smoothstep(Math.min(1, Math.max(0, a - fadeFrom))));
}
