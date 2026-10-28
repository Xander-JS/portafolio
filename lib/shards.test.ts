// Run with: node --test lib/shards.test.ts
import assert from "node:assert/strict";
import { test } from "node:test";
import { contains, heroPattern, inset, livePoints } from "./shards.ts";

test("inset moves every edge of a square inwards by d", () => {
  const sq = [
    { x: 0, y: 0 },
    { x: 100, y: 0 },
    { x: 100, y: 100 },
    { x: 0, y: 100 },
  ];
  assert.deepEqual(
    inset(sq, 10).map((p) => [Math.round(p.x), Math.round(p.y)]),
    [[10, 10], [90, 10], [90, 90], [10, 90]],
  );
  // Same result whatever the winding.
  assert.deepEqual(inset([...sq].reverse(), 10).map((p) => Math.round(p.x)), [10, 90, 90, 10]);
});

test("cells tile the whole panel: every sample point lands in exactly one cell", () => {
  for (const pattern of [heroPattern]) {
    for (const transpose of [false, true]) {
      const pts = livePoints(pattern, 7.3, { x: 0.4, y: 0.5 }, transpose);
      const cells = pattern.cells.map((c) => c.map((n) => pts[n]));
      for (let x = 0.03; x < 1; x += 0.07)
        for (let y = 0.03; y < 1; y += 0.07)
          assert.equal(cells.filter((c) => contains(c, { x, y })).length, 1, `(${x}, ${y})`);
    }
  }
});
