// Run with: node --test lib/sceneGraph.test.ts
import assert from "node:assert/strict";
import { test } from "node:test";
import { BASE_MILESTONES, createGraphData } from "./sceneGraph.ts";

test("sceneGraph creates 8 milestones and valid camera paths", () => {
  assert.equal(BASE_MILESTONES.length, 8, "Must have exactly 8 milestones for 8 steps");

  const data = createGraphData(1.0);
  assert.equal(data.milestones.length, 8);
  assert.ok(data.ambientNodes.length >= 250, "Should generate abundant ambient nodes");
  assert.ok(data.ambientLines.length > 0, "Should have connecting line segments");
  assert.equal(data.backboneLines.length, 7 * 6, "7 segments between 8 milestones (each segment 6 floats)");

  // Test camera curve evaluations at 0 (hero) and 1 (contact)
  const startCam = data.camCurve.getPoint(0);
  const endCam = data.camCurve.getPoint(1);
  assert.ok(startCam.z > endCam.z, "Camera should travel forward along depth Z");
});

test("guarantees minimum distance between nodes (no clumped nodes)", () => {
  const data = createGraphData(1.0);
  const all = [...data.milestones, ...data.ambientNodes];
  let minFound = 999;
  for (let i = 0; i < all.length; i++) {
    for (let j = i + 1; j < all.length; j++) {
      const d = all[i].distanceTo(all[j]);
      if (d < minFound) minFound = d;
    }
  }
  assert.ok(minFound >= 1.59, `Minimum distance should be >= 1.6 (was ${minFound})`);
});

test("responsive factor adjusts horizontal milestone spread", () => {
  const desktop = createGraphData(1.0);
  const mobile = createGraphData(0.5);

  assert.ok(
    mobile.milestones[0].x < desktop.milestones[0].x,
    "Mobile milestones should be closer to center X"
  );
});

test("reusable curve targets preserve camera and look coordinates across viewport sizes", () => {
  for (const factor of [0.4, 0.65, 1]) {
    const graph = createGraphData(factor);
    for (const curve of [graph.camCurve, graph.targetCurve]) {
      const target = curve.getPoint(0);
      for (const progress of [0, 0.01, 0.25, 0.5, 0.99, 1]) {
        const expected = curve.getPoint(progress);
        assert.equal(curve.getPoint(progress, target), target);
        assert.deepEqual(target.toArray(), expected.toArray());
      }
    }
  }
});
