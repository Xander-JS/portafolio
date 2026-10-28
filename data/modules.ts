import { academic, seminars, work } from "./experience";
import { profile } from "./profile";
import { projects } from "./projects";
import { skillGroups, toolGroups } from "./skills";
import { testimonials } from "./testimonials";
import type { PortfolioModule } from "./types";

const toolCount = toolGroups.reduce((n, g) => n + g.skills.length, 0);
const given = testimonials.filter((t) => t.name).length;
const stack = [...new Set(projects.flatMap((p) => p.stack))].filter((s) => s !== "TODO").slice(0, 2).join(" · ");

// The portfolio's parts, in course order. The drum, the nav, the home page and each detail page read from here.
export const modules: PortfolioModule[] = [
  {
    id: "about",
    slug: "about",
    icon: "user",
    label: { es: "Sobre mí", en: "About me" },
    title: { es: "Quién soy", en: "Who I am" },
    description: {
      es: "Soy de Pasto, Nariño, y estudio Ingeniería de Software. Me mueve aprender conceptos nuevos y construir tecnología que resuelva problemas reales.",
      en: "I'm from Pasto, Nariño, and I study Software Engineering. I'm driven by learning new concepts and building technology that solves real problems.",
    },
    facts: [
      { es: "Pasto, Nariño", en: "Pasto, Nariño" },
      { es: "Ing. de Software · 5.º semestre", en: "Software Eng. · 5th semester" },
      { es: "Fútbol, baloncesto y natación", en: "Football, basketball and swimming" },
    ],
  },
  {
    id: "skills",
    slug: "skills",
    icon: "layers",
    label: { es: "Habilidades", en: "Skills" },
    title: { es: "Con qué trabajo", en: "What I work with" },
    description: {
      es: "Entiendo la arquitectura de los lenguajes de programación, así que me adapto rápido a uno nuevo. Aquí están mi stack, mis herramientas de IA y mis editores.",
      en: "I understand how programming languages are built, so I pick up new ones quickly. Here are my stack, AI tools and editors.",
    },
    facts: [
      { es: `${toolCount} herramientas`, en: `${toolCount} tools` },
      { es: `${skillGroups.length} categorías`, en: `${skillGroups.length} categories` },
      { es: "Flutter · Next.js · Claude Code", en: "Flutter · Next.js · Claude Code" },
    ],
  },
  {
    id: "projects",
    slug: "projects",
    icon: "folder",
    label: { es: "Proyectos", en: "Projects" },
    title: { es: "Lo que construyo", en: "What I build" },
    description: {
      es: "Lo que he construido y lo que viene: apps reales, desde el diseño hasta la entrega al cliente.",
      en: "What I've built and what's next: real apps, from design to delivery to the client.",
    },
    facts: [
      { es: `${projects.length} proyectos`, en: `${projects.length} projects` },
      { es: stack, en: stack },
      { es: "1 entrega freelance", en: "1 freelance delivery" },
    ],
  },
  {
    id: "experience",
    slug: "experience",
    icon: "briefcase",
    label: { es: "Experiencia", en: "Experience" },
    title: { es: "Dónde he trabajado", en: "Where I've worked" },
    description: {
      es: "Empecé en tecnología como freelance; antes, un restaurante y una tienda me enseñaron a trabajar con personas.",
      en: "I started in tech as a freelancer; before that, a restaurant and a store taught me to work with people.",
    },
    facts: [
      { es: `${work.length} trabajos`, en: `${work.length} jobs` },
      { es: `${academic.length + seminars.length} entradas académicas`, en: `${academic.length + seminars.length} academic entries` },
      { es: "Freelance móvil · 2 meses", en: "Freelance mobile · 2 months" },
    ],
  },
  {
    id: "testimonials",
    slug: "testimonials",
    icon: "quote",
    label: { es: "Testimonios", en: "Testimonials" },
    title: { es: "Lo que dicen", en: "What people say" },
    description: {
      es: "Lo que dicen quienes han trabajado conmigo: profesores, compañeros y clientes, en texto y en video.",
      en: "What people I've worked with say: professors, teammates and clients, as text and video.",
    },
    facts: [
      given ? { es: `${given} testimonios`, en: `${given} testimonials` } : { es: "Llegan pronto", en: "Coming soon" },
      { es: "Texto y video", en: "Text and video" },
      { es: "Profesores · clientes", en: "Professors · clients" },
    ],
  },
  {
    id: "contact",
    slug: "contact",
    icon: "mail",
    label: { es: "Contacto", en: "Contact" },
    title: { es: "Hablemos", en: "Let's talk" },
    description: {
      es: "Déjame tu nombre y tu mensaje: se abrirá tu correo con todo listo para enviar.",
      en: "Leave your name and message: your email app opens with everything ready to send.",
    },
    facts: [
      { es: profile.email || "Correo y redes", en: profile.email || "Email and socials" },
      { es: "Facebook · LinkedIn", en: "Facebook · LinkedIn" },
      { es: "Formulario directo", en: "Direct form" },
    ],
  },
];

export const moduleById = (id: PortfolioModule["id"]) => modules.find((m) => m.id === id)!;
export const moduleHref = (m: PortfolioModule) => `/${m.slug}`;
