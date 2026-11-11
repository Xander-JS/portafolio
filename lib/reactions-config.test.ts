import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { test } from "node:test";

test("Vercel requires both public Supabase variables; local development remains optional", () => {
  for (const [vercel, url, key, succeeds] of [
    ["1", "", "", false],
    ["1", "https://example.supabase.co", "", false],
    ["1", "", "public-key", false],
    ["1", "https://example.supabase.co", "  ", false],
    ["1", "https://example.supabase.co", "public-key", true],
    ["0", "", "", true],
  ] as const) {
    const result = spawnSync(process.execPath, ["--experimental-strip-types", "next.config.ts"], {
      cwd: new URL("..", import.meta.url),
      env: {
        ...process.env,
        VERCEL: vercel,
        NEXT_PUBLIC_SUPABASE_URL: url,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: key,
      },
      encoding: "utf8",
    });
    assert.equal(result.status, succeeds ? 0 : 1, result.stderr);
    if (!succeeds) assert.match(result.stderr, /Reaction wall: missing NEXT_PUBLIC_SUPABASE_/);
  }
});
