import { academic, seminars, work } from "./experience";
import { profile } from "./profile";
import { projects } from "./projects";
import { skillGroups, toolGroups } from "./skills";
import { testimonials } from "./testimonials";
import type { PortfolioModule } from "./types";

const toolCount = toolGroups.reduce((n, g) => n + g.skills.length, 0);
const given = testimonials.filter((t) => t.name).length;
const stack = [...new Set(projects.flatMap((p) => p.stack))].filter((s) => s !== "TODO").slice(0, 2).join(" · ");

// The carousel below the hero: one card per page, in course order. Counts update with the data files.
export const modules: PortfolioModule[] = [
  {
    id: "about",
    href: "/about",
    icon: "user",
    title: { es: "Quién soy", en: "Who I am" },
    description: { es: "De dónde vengo y qué me mueve.", en: "Where I come from and what drives me." },
    facts: [
      { es: "Pasto, Nariño", en: "Pasto, Nariño" },
      { es: "Ing. de Software · 5.º semestre", en: "Software Eng. · 5th semester" },
      { es: "Fútbol, baloncesto y natación", en: "Football, basketball and swimming" },
    ],
  },
  {
    id: "skills",
    href: "/skills",
    icon: "layers",
    title: { es: "Con qué trabajo", en: "What I work with" },
    description: { es: "Mi stack, mis herramientas de IA y mis editores.", en: "My stack, AI tools and editors." },
    facts: [
      { es: `${toolCount} herramientas`, en: `${toolCount} tools` },
      { es: `${skillGroups.length} categorías`, en: `${skillGroups.length} categories` },
      { es: "Flutter · Next.js · Claude Code", en: "Flutter · Next.js · Claude Code" },
    ],
  },
  {
    id: "projects",
    href: "/projects",
    icon: "folder",
    title: { es: "Lo que construyo", en: "What I build" },
    description: { es: "Apps reales, del diseño a la entrega.", en: "Real apps, from design to delivery." },
    facts: [
      { es: `${projects.length} proyectos`, en: `${projects.length} projects` },
      { es: stack, en: stack },
      { es: "1 entrega freelance", en: "1 freelance delivery" },
    ],
  },
  {
    id: "experience",
    href: "/experience",
    icon: "briefcase",
    title: { es: "Dónde he trabajado", en: "Where I've worked" },
    description: { es: "Trabajo y formación académica.", en: "Work and academic background." },
    facts: [
      { es: `${work.length} trabajos`, en: `${work.length} jobs` },
      { es: `${academic.length + seminars.length} entradas académicas`, en: `${academic.length + seminars.length} academic entries` },
      { es: "Freelance móvil · 2 meses", en: "Freelance mobile · 2 months" },
    ],
  },
  {
    id: "testimonials",
    href: "/testimonials",
    icon: "quote",
    title: { es: "Lo que dicen", en: "What people say" },
    description: { es: "Profesores, compañeros y clientes.", en: "Professors, teammates and clients." },
    facts: [
      given ? { es: `${given} testimonios`, en: `${given} testimonials` } : { es: "Llegan pronto", en: "Coming soon" },
      { es: "Texto y video", en: "Text and video" },
      { es: "Profesores · clientes", en: "Professors · clients" },
    ],
  },
  {
    id: "contact",
    href: "/contact",
    icon: "mail",
    title: { es: "Hablemos", en: "Let's talk" },
    description: { es: "Escríbeme un mensaje directo.", en: "Send me a message directly." },
    facts: [
      { es: profile.email || "Correo y redes", en: profile.email || "Email and socials" },
      { es: "Facebook · LinkedIn", en: "Facebook · LinkedIn" },
      { es: "Formulario directo", en: "Direct form" },
    ],
  },
];
