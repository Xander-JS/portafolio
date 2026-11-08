import type { Project } from "./types";

// Fill every TODO. Images: drop files into public/projects/<slug>/ and write the path, e.g.
// "/projects/marketplace/cover.jpg". Empty image paths show the red placeholder; empty links are hidden.
export const projects: Project[] = [
  {
    slug: "marketplace",
    title: { es: "Marketplace agrícola", en: "Agricultural Marketplace" },
    summary: {
      es: "Kus es un ecosistema agrotech móvil de comercio seguro y directo entre agricultores y compradores con identidades verificadas.",
      en: "Kus is a mobile agrotech ecosystem for secure and direct commerce between farmers and buyers with verified identities.",
    },
    description: [
      {
        es: "La plataforma elimina barreras en el mercado agrícola mediante herramientas especializadas. Combina catálogos en tiempo real, negociación de precios con conversión de unidades, cálculos de rentabilidad y una capa de moderación para proteger cada transacción.",
        en: "The platform eliminates barriers in the agricultural market through specialized tools. It combines real-time catalogs, price negotiations with unit conversion, profitability calculations, and a moderation layer to protect every transaction.",
      },
      {
        es: "Implementado como proyecto freelance de principio a fin en un ciclo ágil de cinco semanas.",
        en: "Implemented as an end-to-end freelance project in an agile five-week cycle.",
      },
    ],
    type: "freelance",
    role: { es: "Desarrollo móvil", en: "Mobile developer" },
    duration: { es: "5 semanas", en: "5 week" },
    status: "completed",
    stack: ["Flutter", "Supabase", "i18n", "IA"],
    features: [
      { es: "Rol agricultor: publica y gestiona su cosecha", en: "Farmer role: lists and manages their harvest" },
      { es: "Rol comprador: busca productos y hace pedidos", en: "Buyer role: browses products and places orders" },
      { es: "Rol moderador: revisa y aprueba usuarios nuevos", en: "Moderator role: Review and approve new users" },
      { es: "Publicación por voz con asistencia IA", en: "Voice publishing with AI assistance" },
      { es: "Interfaz en español e inglés", en: "Interface in Spanish and English" },
    ],
    cover: "/assets/img/apps/app_movil/img_movil.webp",
    gallery: [
      "/assets/img/apps/app_movil/01.jpeg",
      "/assets/img/apps/app_movil/02.jpeg",
      "/assets/img/apps/app_movil/03.jpeg",
      "/assets/img/apps/app_movil/04.jpeg",
      "/assets/img/apps/app_movil/00.jpeg",
    ],
    repoUrl: "",
    demoUrl: "https://agriculturalmarketplace.vercel.app/",
    apkUrl: "https://github.com/Xander-JS/agricultural_marketplace/releases/download/V1.0/app-release.apk",
  },
  {
    slug: "dj-ai-web",
    title: { es: "DJ AI Web", en: "DJ AI Web" },
    summary: {
      es: "TODO: una frase sobre qué hace y para quién.",
      en: "TODO: one sentence on what it does and who it is for.",
    },
    description: [{ es: "TODO: descripción completa del proyecto.", en: "TODO: full project description." }],
    type: "personal", // TODO: "freelance" | "personal" | "academic"
    role: { es: "TODO: tu rol", en: "TODO: your role" },
    duration: { es: "TODO", en: "TODO" },
    status: "inProgress", // TODO: "completed" | "inProgress" | "planned"
    stack: ["TODO"],
    features: [{ es: "TODO: función clave", en: "TODO: key feature" }],
    cover: "", // TODO: "/projects/dj-ai-web/cover.jpg"
    gallery: ["", "", ""], // TODO
    repoUrl: "", // TODO
    demoUrl: "", // TODO
  },
  {
    slug: "smartwatch-app",
    title: { es: "App para smartwatch", en: "Smartwatch App" },
    summary: {
      es: "TODO: una frase sobre qué hace y para quién.",
      en: "TODO: one sentence on what it does and who it is for.",
    },
    description: [{ es: "TODO: descripción completa del proyecto.", en: "TODO: full project description." }],
    type: "personal", // TODO
    role: { es: "TODO: tu rol", en: "TODO: your role" },
    duration: { es: "TODO", en: "TODO" },
    status: "inProgress", // TODO
    stack: ["TODO"],
    features: [{ es: "TODO: función clave", en: "TODO: key feature" }],
    cover: "", // TODO: "/projects/smartwatch-app/cover.jpg"
    gallery: ["", "", ""], // TODO
    repoUrl: "", // TODO
    demoUrl: "", // TODO
  },
];
