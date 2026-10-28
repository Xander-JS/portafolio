import type { Project } from "./types";

// Fill every TODO. Images: drop files into public/projects/<slug>/ and write the path, e.g.
// "/projects/marketplace/cover.jpg". Empty image paths show the red placeholder; empty links are hidden.
export const projects: Project[] = [
  {
    slug: "marketplace",
    title: { es: "Marketplace agrícola", en: "Agricultural Marketplace" },
    summary: {
      es: "App móvil donde los agricultores venden su cosecha directamente a compradores, con moderación incluida.",
      en: "A mobile app where farmers sell their harvest straight to buyers, with moderation built in.",
    },
    description: [
      {
        es: "Un marketplace móvil que conecta a agricultores con compradores sin intermediarios. Cada agricultor publica su cosecha, el comprador la encuentra y la pide, y un moderador cuida que las publicaciones sean reales.",
        en: "A mobile marketplace that connects farmers with buyers without middlemen. Each farmer lists their harvest, buyers find and order it, and a moderator makes sure listings are genuine.",
      },
      {
        es: "Lo construí como freelance en dos meses con Flutter y Supabase, y está disponible en español e inglés.",
        en: "I built it as a freelancer in two months with Flutter and Supabase, and it is available in Spanish and English.",
      },
    ],
    type: "freelance",
    role: { es: "Desarrollo móvil", en: "Mobile developer" },
    duration: { es: "2 meses", en: "2 months" },
    status: "completed",
    stack: ["Flutter", "Supabase", "i18n"],
    features: [
      { es: "Rol agricultor: publica y gestiona su cosecha", en: "Farmer role: lists and manages their harvest" },
      { es: "Rol comprador: busca productos y hace pedidos", en: "Buyer role: browses products and places orders" },
      { es: "Rol moderador: revisa y aprueba publicaciones", en: "Moderator role: reviews and approves listings" },
      { es: "Interfaz en español e inglés", en: "Interface in Spanish and English" },
    ],
    cover: "", // TODO: "/projects/marketplace/cover.jpg"
    gallery: ["", "", ""], // TODO: "/projects/marketplace/1.jpg", …
    repoUrl: "", // TODO
    demoUrl: "", // TODO
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
