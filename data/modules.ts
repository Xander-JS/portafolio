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
      es: "Hola, soy Marlon Alexander. Un apasionado por la tecnología y muy atento a los detalles. Disfruto aprender, explorar nuevas ideas y convertirlas en productos reales.",
      en: "Hi, I'm Marlon Alexander. I'm passionate about technology and have a keen eye for detail. I enjoy learning, exploring new ideas, and turning them into real products.",
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
      es: "Mi fortaleza está en comprender la lógica detrás del código y adaptarme a cualquier tecnología.",
      en: "My strength is understanding the logic behind the code and adapting to any technology.",
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
      es: "Un recorrido por lo que he aprendido, creado y construido.",
      en: "A journey through what I've learned, created, and built.",
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
      es: "Experiencias y opiniones de personas que han compartido proyectos, aprendizajes y desafíos conmigo.",
      en: "Experiences and opinions from people who have shared projects, learnings, and challenges with me.",
    },
    facts: [
      given ? { es: `${given} testimonios`, en: `${given} testimonials` } : { es: "Llegan pronto", en: "Coming soon" },
      { es: "Texto y video", en: "Text and video" },
      { es: "Profesores · clientes", en: "Professors · clients" },
    ],
  },
  {
    id: "reserved",
    slug: "reservada",
    icon: "layers",
    label: { es: "Reservada", en: "Reserved" },
    title: { es: "Espacio reservado", en: "Reserved space" },
    description: {
      es: "Sección reservada para el próximo módulo del portafolio.",
      en: "Reserved section for the next portfolio module.",
    },
    facts: [
      { es: "Próximamente", en: "Coming soon" },
      { es: "Nuevo módulo", en: "New module" },
      { es: "En preparación", en: "In preparation" },
    ],
  },
];

const contactFallback: PortfolioModule = {
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
};

export const moduleById = (id: PortfolioModule["id"]) =>
  modules.find((m) => m.id === id) ?? contactFallback;
export const moduleHref = (m: PortfolioModule) => `/${m.slug}`;
