/**
 * Shared driver for the cinematic camera transition between module pages.
 *
 * Both the "Next / Finish" control (ModuleProgressNav) and the header links use this so the timing and
 * behaviour stay identical. It adds the leaving class to <main>, waits the matching duration (kept in sync
 * with the keyframes in globals.css), then runs the navigation. If motion is reduced or <main> isn't present
 * (e.g. the scrollytelling home has no module content), it bails out so the caller lets the plain link
 * navigate instead.
 */

/** Camera animation lengths — keep in sync with `.module-leaving-*` in app/globals.css. */
export const MODULE_DIVE_MS = 560;
export const MODULE_PULLBACK_MS = 700;

export type ModuleTransitionMode = "forward" | "pullback";

/**
 * Plays the exit animation and schedules `navigate`. Returns true when it took over (caller should
 * `preventDefault`), or false when it did nothing and the default navigation should proceed.
 */
export function runModuleTransition(
  mode: ModuleTransitionMode,
  navigate: () => void,
): boolean {
  if (typeof window === "undefined") return false;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const main = document.getElementById("main");
  if (prefersReducedMotion || !main) return false;

  main.classList.add(
    mode === "pullback" ? "module-leaving-pullback" : "module-leaving-forward",
  );
  window.setTimeout(
    navigate,
    mode === "pullback" ? MODULE_PULLBACK_MS : MODULE_DIVE_MS,
  );
  return true;
}

/** True for a plain left-click with no modifier keys (so new-tab / middle-click keep default behaviour). */
export function isPlainClick(e: {
  metaKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  button: number;
}): boolean {
  return (
    !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0
  );
}
