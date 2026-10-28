// Run with: node --test lib/drum.test.ts
import assert from "node:assert/strict";
import { test } from "node:test";
import { drumOpacity, drumPose, dwell } from "./drum.ts";

test("dwell rests on whole cards and passes the midpoint unchanged", () => {
  assert.equal(dwell(2), 2);
  assert.equal(dwell(2.5), 2.5);
  assert.ok(Math.abs(dwell(2.15) - 2) < 0.01, "near a card it barely moves");
  assert.ok(dwell(2.3) < dwell(2.4) && dwell(2.4) < dwell(2.6), "monotonic");
});

test("pose: focused card centred and forward; neighbours mirror above and below", () => {
  assert.deepEqual(drumPose(0, 700, 240), { y: 0, z: 400, rot: 0 });
  const below = drumPose(1, 700, 240);
  const above = drumPose(-1, 700, 240);
  assert.ok(below.y > 0 && below.rot > 90, "the next card waits below, showing its back");
  assert.equal(above.y, -below.y);
  assert.equal(above.rot, -below.rot);
  assert.ok(drumPose(2, 700, 240).y > below.y && drumPose(3, 700, 240).y > drumPose(2, 700, 240).y, "further out");
  assert.ok(drumPose(2, 360, 160).y > drumPose(1, 360, 160).y, "still ordered on a short drum");
});

test("opacity: full when focused, dimmed beside it, gone far away", () => {
  assert.equal(drumOpacity(0, 2), 1);
  assert.equal(drumOpacity(1, 2), 0.4);
  assert.equal(drumOpacity(3, 2), 0);
  assert.equal(drumOpacity(2, 1), 0);
});
