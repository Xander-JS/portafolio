import { create } from "zustand";
import { STEP_COUNT } from "@/data/steps";

/**
 * Scroll state shared between the DOM UI (nav index, info card) and the Three.js scene inside the <Canvas>.
 * The Canvas is a separate React renderer, so context can't reach it — an external store (Zustand) can, which is
 * why the scene reads `useScrollStore.getState()` inside its frame loop without re-rendering React.
 */
type ScrollState = {
  /** Active step, 0 … STEP_COUNT-1 (00–07). */
  index: number;
  /** Overall scroll progress 0 … 1, for the [xxx] counter and the 3D morph lerp. */
  progress: number;
  /** True while the camera zooms in when entering a module. */
  isWarping: boolean;
  /** True when returning from the last module directly to the Contact section. */
  pendingContact: boolean;
  setProgress: (progress: number) => void;
  setWarping: (warping: boolean) => void;
  setPendingContact: (pending: boolean) => void;
};

const indexFor = (p: number) => Math.max(0, Math.min(STEP_COUNT - 1, Math.round(p * (STEP_COUNT - 1))));

export const useScrollStore = create<ScrollState>((set, get) => ({
  index: 0,
  progress: 0,
  isWarping: false,
  pendingContact: false,
  setProgress: (progress) => {
    const clamped = Math.max(0, Math.min(1, progress));
    const index = indexFor(clamped);
    if (clamped !== get().progress || index !== get().index) set({ progress: clamped, index });
  },
  setWarping: (isWarping) => {
    if (isWarping !== get().isWarping) set({ isWarping });
  },
  setPendingContact: (pendingContact) => {
    if (pendingContact !== get().pendingContact) set({ pendingContact });
  },
}));
