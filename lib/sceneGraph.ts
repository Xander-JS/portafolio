import { CatmullRomCurve3, Vector3 } from "three";

// Deterministic PRNG (mulberry32) so the 3D constellation is stable across re-renders
function seeded(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * 7 Milestone node positions in 3D world space (one per step in data/steps.ts):
 * 00: Hero, 01: About, 02: Skills, 03: Experience, 04: Projects, 05: Testimonials, 06: Contact.
 * Arranged along a deep serpentine path (advancing in Z) biased towards the right/center
 * so the left side remains clear and legible for the UI typography.
 */
export const BASE_MILESTONES: Vector3[] = [
  new Vector3(2.2, 0.4, 0),       // 00: Hero
  new Vector3(2.8, -0.6, -9),     // 01: About
  new Vector3(1.6, 1.4, -18),     // 02: Skills
  new Vector3(3.2, 0.2, -27),     // 03: Experience
  new Vector3(1.8, -1.2, -36),    // 04: Projects
  new Vector3(2.6, 1.0, -45),     // 05: Testimonials
  new Vector3(2.0, 0.0, -54),     // 06: Contact
];

/**
 * Camera waypoints corresponding to each step.
 * Camera stays slightly behind and to the left of the milestone, providing a forward-tracking perspective.
 */
export const BASE_CAMERA_WAYPOINTS: Vector3[] = [
  new Vector3(-0.2, 0.5, 6.0),    // C0
  new Vector3(0.4, -0.2, -3.0),   // C1
  new Vector3(-0.4, 0.8, -12.0),  // C2
  new Vector3(0.6, 0.3, -21.0),   // C3
  new Vector3(-0.2, -0.5, -30.0), // C4
  new Vector3(0.4, 0.6, -39.0),   // C5
  new Vector3(0.0, 0.2, -48.0),   // C6
];

/**
 * Look-at targets for the camera at each step, focusing directly onto or slightly offset around the milestone.
 */
export const BASE_TARGET_WAYPOINTS: Vector3[] = [
  new Vector3(1.8, 0.3, 0),
  new Vector3(2.3, -0.5, -9),
  new Vector3(1.4, 1.1, -18),
  new Vector3(2.6, 0.1, -27),
  new Vector3(1.5, -0.9, -36),
  new Vector3(2.2, 0.8, -45),
  new Vector3(1.7, 0.1, -54),
];

export type GraphData = {
  milestones: Vector3[];
  ambientNodes: Vector3[];
  ambientLines: Float32Array;
  backboneLines: Float32Array;
  camCurve: CatmullRomCurve3;
  targetCurve: CatmullRomCurve3;
};

/**
 * Builds an organic, uncluttered 3D constellation:
 * - Enforcing a strict minimum distance (Poisson-disk rejection) so NO nodes clump together.
 * - Enveloping cylindrical distribution that keeps the central line of sight open and deep.
 * - Local satellites around each milestone to balance the right-hand wing.
 * - Clean, non-crossing network edges.
 */
export function createGraphData(horizontalFactor = 1.0): GraphData {
  const milestones = BASE_MILESTONES.map(
    (v) => new Vector3(v.x * horizontalFactor, v.y, v.z)
  );

  const cameraWaypoints = BASE_CAMERA_WAYPOINTS.map(
    (v) => new Vector3(v.x * horizontalFactor, v.y, v.z)
  );

  const targetWaypoints = BASE_TARGET_WAYPOINTS.map(
    (v) => new Vector3(v.x * horizontalFactor, v.y, v.z)
  );

  const camCurve = new CatmullRomCurve3(cameraWaypoints, false, "catmullrom", 0.5);
  const targetCurve = new CatmullRomCurve3(targetWaypoints, false, "catmullrom", 0.5);

  const rand = seeded(1906);
  const MIN_DIST = 1.6;
  const MIN_DIST_SQ = MIN_DIST * MIN_DIST;

  const allNodes: Vector3[] = milestones.map((m) => m.clone());

  function canPlace(candidate: Vector3): boolean {
    for (let i = 0; i < allNodes.length; i++) {
      const n = allNodes[i];
      if (Math.abs(n.z - candidate.z) > MIN_DIST) continue;
      if (n.distanceToSquared(candidate) < MIN_DIST_SQ) return false;
    }
    return true;
  }

  // 1. Satellites around each milestone: covers right wing with clean, well-spaced nodes
  milestones.forEach((m) => {
    let placed = 0;
    let attempts = 0;
    while (placed < 26 && attempts < 120) {
      attempts++;
      const theta = rand() * Math.PI * 2;
      const r = 1.4 + rand() * 4.2;
      const rx = (Math.cos(theta) * r + 0.6) * horizontalFactor;
      const ry = Math.sin(theta) * r * 0.75;
      const rz = (rand() - 0.5) * 5.0;
      const candidate = new Vector3(m.x + rx, m.y + ry, m.z + rz);
      if (canPlace(candidate)) {
        allNodes.push(candidate);
        placed++;
      }
    }
  });

  // 2. Enveloping ambient tunnel: radius between 2.8 and 9.5 from center
  // Keeps the central forward line of sight clear and avoids depth clumping
  const zMin = 8;
  const zMax = -62;
  const zRange = zMax - zMin;
  const TARGET_AMBIENT = 300;

  let placedAmbient = 0;
  let attempts = 0;
  while (placedAmbient < TARGET_AMBIENT && attempts < 1600) {
    attempts++;
    const z = zMin + rand() * zRange;
    const theta = rand() * Math.PI * 2;
    const r = 2.8 + rand() * 7.0;
    const x = Math.cos(theta) * r * 1.5 * horizontalFactor;
    const y = Math.sin(theta) * r * 0.9;
    const candidate = new Vector3(x, y, z);
    if (canPlace(candidate)) {
      allNodes.push(candidate);
      placedAmbient++;
    }
  }

  const ambientNodes = allNodes.slice(milestones.length);

  // 3. Clean network connections
  const edges = new Set<string>();

  // Milestone connections to 4 nearest neighbors within max distance 3.8
  milestones.forEach((m, mIdx) => {
    const dists = ambientNodes
      .map((a, aIdx) => ({
        idx: aIdx + milestones.length,
        dist: m.distanceTo(a),
      }))
      .filter((o) => o.dist < 3.8)
      .sort((a, b) => a.dist - b.dist);

    dists.slice(0, 4).forEach(({ idx }) => {
      edges.add(`${mIdx}-${idx}`);
    });
  });

  // Ambient connections to at most 2 nearest neighbors within 3.4
  for (let i = 0; i < ambientNodes.length; i++) {
    const a = ambientNodes[i];
    const aIdx = i + milestones.length;
    const nearby: { j: number; d: number }[] = [];

    for (let j = 0; j < ambientNodes.length; j++) {
      if (i === j) continue;
      const b = ambientNodes[j];
      if (Math.abs(a.z - b.z) > 3.4) continue;
      const d = a.distanceTo(b);
      if (d < 3.4) {
        nearby.push({ j: j + milestones.length, d });
      }
    }

    nearby.sort((x, y) => x.d - y.d);
    nearby.slice(0, 2).forEach(({ j }) => {
      edges.add(aIdx < j ? `${aIdx}-${j}` : `${j}-${aIdx}`);
    });
  }

  const ambientSeg: number[] = [];
  edges.forEach((key) => {
    const [i, j] = key.split("-").map(Number);
    const p1 = allNodes[i];
    const p2 = allNodes[j];
    if (p1 && p2) {
      ambientSeg.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
    }
  });

  // Backbone lines connecting sequential milestones
  const backboneSeg: number[] = [];
  for (let i = 0; i < milestones.length - 1; i++) {
    const p1 = milestones[i];
    const p2 = milestones[i + 1];
    backboneSeg.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
  }

  return {
    milestones,
    ambientNodes,
    ambientLines: new Float32Array(ambientSeg),
    backboneLines: new Float32Array(backboneSeg),
    camCurve,
    targetCurve,
  };
}
