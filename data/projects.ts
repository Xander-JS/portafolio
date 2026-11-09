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
      "/assets/img/apps/app_movil/00.jpeg",
      "/assets/img/apps/app_movil/04.jpeg",
    ],
    repoUrl: "",
    demoUrl: "https://agriculturalmarketplace.vercel.app/",
    apkUrl: "https://github.com/Xander-JS/agricultural_marketplace/releases/download/V1.0/app-release.apk",
    device: "mobile",
  },
  {
    slug: "dj-ai",
    title: { es: "DJ AI", en: "DJ AI" },
    summary: {
      es: "SYSTEM DJ es una estación de mezcla y cabina DJ profesional, la cual cuenta con procesamiento de audio 100% local y recomendaciones armónicas asistidas por IA.",
      en: "SYSTEM DJ is a professional mixing station and DJ booth featuring 100% local audio processing and AI-assisted harmonic recommendations.",
    },
    description: [
      {
        es: "La plataforma traslada la experiencia de una cabina DJ profesional directamente al navegador y en tu ordenador, garantizando privacidad total al procesar y almacenar el audio íntegramente en el dispositivo del usuario. Combina un motor de Audio de baja latencia con doble deck sincronizado, análisis musical determinista de tempo y tonalidad Camelot, ecualización en tiempo real y un asistente inteligente que sugiere transiciones armónicas con explicaciones en lenguaje natural.",
        en: "The platform brings the experience of a professional DJ booth directly to the browser and your desktop computer, guaranteeing total privacy by processing and storing audio entirely on the user's device. It combines a low-latency audio engine with synchronized dual decks, deterministic tempo and Camelot key analysis, real-time equalization, and an intelligent assistant that suggests harmonic transitions with natural language explanations.",
      },
      {
        es: "Implementado de principio a fin con una arquitectura modular y reactiva en un ciclo ágil de cinco semanas.",
        en: "Implemented end-to-end with a modular and reactive architecture in an agile five-week cycle.",
      },
    ],
    type: "personal",
    role: { es: "Desarrollo web", en: "Web development" },
    duration: { es: "5 semanas", en: "5 weeks" },
    status: "completed",
    device: "desktop",
    stack: ["React", "Web Audio API", "Supabase", "IA", "i18n"],
    features: [
      {
        es: "Cabina de doble deck: sincronización avanzada (SYNC, ALIGN, BAR SYNC), pitch bend y hot cues",
        en: "Dual-deck booth: advanced synchronization (SYNC, ALIGN, BAR SYNC), pitch bend, and hot cues",
      },
      {
        es: "Análisis musical en local: detección de BPM, tonalidad Camelot, energía y beatgrid editable",
        en: "Local musical analysis: BPM detection, Camelot key, energy level, and editable beatgrid",
      },
      {
        es: "Recomendaciones con IA: sugerencias de mezcla armónica con explicaciones técnicas de transición",
        en: "AI recommendations: harmonic mix suggestions with technical transition explanations",
      },
      {
        es: "Grabación y exportación cliente: captura de sesiones en vivo y codificación local en WAV y MP3",
        en: "Client-side recording & export: live session capture and local encoding in WAV and MP3",
      },
      {
        es: "Privacidad nativa e i18n: cero transferencia de audio a la nube e interfaz en español e inglés",
        en: "Native privacy & i18n: zero audio cloud transfers and interface in Spanish and English",
      },
    ],
    cover: "/assets/img/apps/app_escritorio/img-escritorio.webp",
    gallery: [
      "/assets/img/apps/app_escritorio/00.png",
      "/assets/img/apps/app_escritorio/01.png",
      "/assets/img/apps/app_escritorio/02.png",
      "/assets/img/apps/app_escritorio/03.png",
      "/assets/img/apps/app_escritorio/04.png",
      "/assets/img/apps/app_escritorio/05.png",
    ],
    repoUrl: "",
    // Rutas listas; reemplazar '#' por las rutas de descarga y web definitivas
    windowsUrl: "#",
    linuxUrl: "#",
    demoUrl: "#",
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
