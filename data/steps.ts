import { moduleHref, modules } from "./modules";
import { profile } from "./profile";
import type { IconName, Localized } from "./types";

/**
 * One scroll step of the scrollytelling home:
 * - step 00 is the identity hero (no module page)
 * - steps 01–06 are the six navigable modules (About, Skills, Projects, Experience, Testimonials, Reservada)
 * - step 07 is Contact (shown directly on screen like Hero, with no separate module page)
 */
export type Step = {
  icon: IconName;
  label: Localized;
  title: Localized;
  description: Localized;
  /** Present only for steps that open a dedicated module window. */
  href?: string;
};

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

const contact: Step = {
  icon: "mail",
  label: { es: "Contacto", en: "Contact" },
  title: { es: "Hablemos", en: "Let's talk" },
  description: {
    es: profile.email
      ? `Escríbeme a ${profile.email} o encuéntrame en mis redes sociales para conversar sobre proyectos y oportunidades.`
      : "Escríbeme o encuéntrame en mis redes sociales para conversar sobre proyectos y oportunidades.",
    en: profile.email
      ? `Write to me at ${profile.email} or find me on social media to talk about projects and opportunities.`
      : "Write to me or find me on social media to talk about projects and opportunities.",
  },
};

// Modules carry icon/label/title/description in both languages plus their dedicated route.
export const steps: Step[] = [
  hero,
  ...modules.map((m) => ({
    icon: m.icon,
    label: m.label,
    title: m.title,
    description: m.description,
    href: moduleHref(m),
  })),
  contact,
];
export const STEP_COUNT = steps.length; // 8 → index 0…7 (00–07)
