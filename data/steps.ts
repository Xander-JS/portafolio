import { modules } from "./modules";
import { profile } from "./profile";
import type { IconName, Localized } from "./types";

/**
 * One scroll step of the scrollytelling home: step 00 is the identity hero, steps 01–06 are the six modules in order.
 * Feeds the 3D morph target, the right nav index and the bottom-left info card — all from this single list.
 */
export type Step = { icon: IconName; label: Localized; title: Localized; description: Localized };

// The hero's big display text (name + eyebrow + tagline) is read from profile + messages.hero by LeftContent; this
// entry mainly supplies the right-nav name and keeps the hero as step 00. Title falls back to the full name.
const hero: Step = {
  icon: "code",
  label: { es: "Inicio", en: "Hero" },
  title: { es: profile.name, en: profile.name },
  description: {
    es: "Desplázate para recorrer quién soy, qué construyo y cómo contactarme.",
    en: "Scroll to move through who I am, what I build and how to reach me.",
  },
};

// Modules already carry icon/label/title/description in both languages, so they are steps as-is.
export const steps: Step[] = [hero, ...modules];
export const STEP_COUNT = steps.length; // 7 → index 0…6 (00–06)
