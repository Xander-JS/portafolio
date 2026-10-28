// Geometry for the smoked-glass shard panels (see promt-guide.md, "The cut pattern").
export type Pt = { x: number; y: number };

/** How a point may drift: along x (top/bottom edge), y (left/right edge), both (junction) or not at all (corner). */
export type Axis = "x" | "y" | "xy" | "";

export type CutPattern = {
  points: Record<string, Pt & { m: Axis }>;
  cells: string[][];
};

const corner = (x: number, y: number) => ({ x, y, m: "" as Axis });
const corners = { TL: corner(0, 0), TR: corner(1, 0), BR: corner(1, 1), BL: corner(0, 1) };

// Five cells measured from the reference; A is the hero cell.
export const heroPattern: CutPattern = {
  points: {
    ...corners,
    tAB: { x: 0.22, y: 0, m: "x" },
    tBC: { x: 0.515, y: 0, m: "x" },
    tCE: { x: 0.84, y: 0, m: "x" },
    bAD: { x: 0.34, y: 1, m: "x" },
    bDE: { x: 0.865, y: 1, m: "x" },
    J0: { x: 0.385, y: 0.72, m: "xy" },
    J1: { x: 0.48, y: 0.62, m: "xy" },
    J2: { x: 0.716, y: 0.49, m: "xy" },
  },
  cells: [
    ["TL", "tAB", "J0", "bAD", "BL"],
    ["tAB", "tBC", "J1", "J0"],
    ["tBC", "tCE", "J2", "J1"],
    ["J0", "J1", "J2", "bDE", "bAD"],
    ["tCE", "TR", "BR", "bDE", "J2"],
  ],
};

// Five spokes around one junction, for the contact panel.
export const contactPattern: CutPattern = {
  points: {
    ...corners,
    tA: { x: 0.3, y: 0, m: "x" },
    tB: { x: 0.7, y: 0, m: "x" },
    rA: { x: 1, y: 0.38, m: "y" },
    bA: { x: 0.46, y: 1, m: "x" },
    lA: { x: 0, y: 0.62, m: "y" },
    J: { x: 0.56, y: 0.44, m: "xy" },
  },
  cells: [
    ["TL", "tA", "J", "lA"],
    ["tA", "tB", "J"],
    ["tB", "TR", "rA", "J"],
    ["J", "rA", "BR", "bA"],
    ["lA", "J", "bA", "BL"],
  ],
};

/** Live point positions in panel-normalised coords: slow sine drift plus a push away from the pointer. */
export function livePoints(p: CutPattern, t: number, pointer: Pt | null, transpose: boolean) {
  const out: Record<string, Pt> = {};
  let i = 0;
  for (const [name, b] of Object.entries(p.points)) {
    i++;
    let x = b.x;
    let y = b.y;
    const period = 10 + ((i * 3.7) % 10); // 10–20 s, different per point
    const phase = i * 1.3;
    if (b.m.includes("x")) x += 0.03 * Math.sin((t / period) * 2 * Math.PI + phase);
    if (b.m === "y") y += 0.03 * Math.sin((t / period) * 2 * Math.PI + phase);
    if (b.m === "xy") y += 0.05 * Math.cos((t / (period * 1.2)) * 2 * Math.PI + phase);
    if (transpose) [x, y] = [y, x];
    if (pointer && b.m) {
      const dx = x - pointer.x;
      const dy = y - pointer.y;
      const d = Math.hypot(dx, dy);
      if (d > 0.0001 && d < 0.6) {
        const push = 0.05 * (1 - d / 0.6);
        // Edge points stay on their edge.
        const ax = transpose && b.m !== "xy" ? (b.m === "x" ? "y" : "x") : b.m;
        if (ax.includes("x")) x += (dx / d) * push;
        if (ax.includes("y")) y += (dy / d) * push;
      }
    }
    out[name] = { x, y };
  }
  return out;
}

const signedArea = (poly: Pt[]) =>
  poly.reduce((a, p, i) => {
    const q = poly[(i + 1) % poly.length];
    return a + p.x * q.y - q.x * p.y;
  }, 0) / 2;

/** Offsets every edge of a polygon inwards by `d` and returns the new corners. */
export function inset(poly: Pt[], d: number): Pt[] {
  const s = signedArea(poly) > 0 ? 1 : -1;
  const n = poly.length;
  const lines = poly.map((p, i) => {
    const q = poly[(i + 1) % n];
    const len = Math.hypot(q.x - p.x, q.y - p.y) || 1;
    const nx = (-(q.y - p.y) / len) * s;
    const ny = ((q.x - p.x) / len) * s;
    return { p: { x: p.x + nx * d, y: p.y + ny * d }, v: { x: q.x - p.x, y: q.y - p.y } };
  });
  return poly.map((orig, i) => {
    const a = lines[(i - 1 + n) % n];
    const b = lines[i];
    const den = a.v.x * b.v.y - a.v.y * b.v.x;
    if (Math.abs(den) < 1e-9) return b.p; // parallel edges: the offset point is already on both lines
    const t = ((b.p.x - a.p.x) * b.v.y - (b.p.y - a.p.y) * b.v.x) / den;
    return { x: a.p.x + a.v.x * t, y: a.p.y + a.v.y * t };
  });
}

/** SVG / CSS path of a polygon with rounded corners. */
export function roundedPath(poly: Pt[], r: number) {
  const n = poly.length;
  let d = "";
  poly.forEach((p, i) => {
    const prev = poly[(i - 1 + n) % n];
    const next = poly[(i + 1) % n];
    const toward = (q: Pt) => {
      const len = Math.hypot(q.x - p.x, q.y - p.y) || 1;
      const k = Math.min(r, len * 0.45) / len;
      return { x: p.x + (q.x - p.x) * k, y: p.y + (q.y - p.y) * k };
    };
    const a = toward(prev);
    const b = toward(next);
    d += `${i ? "L" : "M"}${a.x.toFixed(1)} ${a.y.toFixed(1)}Q${p.x.toFixed(1)} ${p.y.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
  });
  return d + "Z";
}

export function contains(poly: Pt[], pt: Pt) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i];
    const b = poly[j];
    if (a.y > pt.y !== b.y > pt.y && pt.x < ((b.x - a.x) * (pt.y - a.y)) / (b.y - a.y) + a.x) inside = !inside;
  }
  return inside;
}

export const centroid = (poly: Pt[]) => ({
  x: poly.reduce((s, p) => s + p.x, 0) / poly.length,
  y: poly.reduce((s, p) => s + p.y, 0) / poly.length,
});
