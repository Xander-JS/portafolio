import type { Project } from "./types";

// Fill every TODO. Images: drop files into public/projects/<slug>/ and write the path, e.g.
// "/projects/marketplace/cover.jpg". Empty image paths show the red placeholder; empty links are hidden.
export const projects: Project[] = [
  {
    slug: "marketplace",
    title: { es: "Kumpa Sumaq", en: "Kumpa Sumaq" },
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
    cover: "/assets/img/apps/app_movil/img-movil.webp",
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
    windowsUrl: "https://github.com/Xander-JS/dj_ai_web/releases/download/v1.0.1/SYSTEM.DJ.Setup.1.0.1.exe",
    linuxUrl: "https://github.com/Xander-JS/dj_ai_web/releases/download/v1.0.1/SYSTEM.DJ-1.0.1.AppImage",
    demoUrl: "https://dj-ai-web.vercel.app/",
  },
  {
    slug: "sudo-kill-9",
    title: { es: "SUDO KILL -9", en: "SUDO KILL -9" },
    summary: {
      es: "SUDO KILL -9 es un videojuego de acción y combate táctico en tercera persona, el cual enfrenta al pingüino Tux contra la personificación del sistema operativo Windows con síntesis de voz reactiva e IA local.",
      en: "SUDO KILL -9 is a third-person tactical action and combat video game that pits Tux the penguin against the personification of the Windows operating system with reactive voice synthesis and local AI.",
    },
    description: [
      {
        es: "La experiencia traslada la legendaria rivalidad de los sistemas operativos directamente al navegador y al escritorio, garantizando un rendimiento fluido y libre de latencia al ejecutar la lógica de combate y el pipeline de audio íntegramente en local. Combina un sistema de disparos con apuntado dinámico, control de cámaras cinematográficas (orbital e isométrica), arenas de supervivencia por oleadas con efectos visuales de glitch BSOD y un microservicio inteligente que sintetiza líneas de voz para el jefe en tiempo real con latencia cero en memoria.",
        en: "The platform brings the legendary operating system rivalry directly to the browser and desktop, guaranteeing smooth, latency-free performance by running combat logic and the audio pipeline entirely locally. It combines a dynamic aiming shooting system, cinematic camera control (orbital and isometric), wave-based survival arenas with BSOD glitch visual effects, and an intelligent microservice that synthesizes boss voice lines in real time with zero in-memory latency.",
      },
      {
        es: "Implementado de principio a fin con una arquitectura modular y reactiva en un ciclo ágil de dos meses.",
        en: "Implemented end-to-end with a modular and reactive architecture in an agile two-month cycle.",
      },
    ],
    type: "personal",
    role: { es: "Desarrollo de videojuegos", en: "Game development" },
    duration: { es: "2 meses", en: "2 months" },
    status: "completed",
    device: "desktop",
    stack: ["Unity", "C#", "FastAPI", "edge-tts", "WebGL"],
    features: [
      {
        es: "Combate en tercera persona: mecánicas de apuntado dinámico, esquiva táctica, retroceso responsivo y sistema de salud reactivo",
        en: "Third-person combat: dynamic aiming mechanics, tactical dodge, responsive recoil, and reactive health system",
      },
      {
        es: "Jefe con síntesis de voz en local: microservicio de TTS reactivo con caché en memoria RAM para diálogos dinámicos del villano",
        en: "Local voice-synthesized boss: reactive TTS microservice with RAM caching for dynamic villain dialogues",
      },
      {
        es: "Modos de supervivencia y arena: control de oleadas y reaparición perimetral con condiciones de victoria por tiempo y limpieza",
        en: "Survival and arena modes: wave control and perimeter spawning with time-based and clear-based victory conditions",
      },
      {
        es: "Efectos visuales de impacto: habilidades cinemáticas, proyectiles teledirigidos y transiciones con estética BSOD",
        en: "Impactful visual effects: cinematic abilities, homing projectiles, and BSOD-aesthetic transitions",
      },
      {
        es: "Despliegue multiplataforma e i18n: soporte nativo para Linux, Windows y WebGL con interfaz y subtítulos localizados",
        en: "Cross-platform deployment & i18n: native support for Linux, Windows, and WebGL with localized UI and subtitles",
      },
    ],
    cover: "/assets/img/apps/videojuego/linux-home.webp",
    gallery: [
      "/assets/img/apps/videojuego/00.png",
      "/assets/img/apps/videojuego/01.png",
      "/assets/img/apps/videojuego/02.png",
      "/assets/img/apps/videojuego/03.png",
      "/assets/img/apps/videojuego/04.png",
      "/assets/img/apps/videojuego/05.png",
      "/assets/img/apps/videojuego/06.png",
    ],
    repoUrl: "",
    windowsUrl: "https://github.com/Xander-JS/sudo-kill-9/releases/download/Win-V1.0/Run_Windows.zip",
    linuxUrl: "https://github.com/Xander-JS/sudo-kill-9/releases/download/LIN-V1.0/linux.zip",
    demoUrl: "https://stunning-moonbeam-47eb8e.netlify.app/",
  },
  {
    slug: "smartwatch-app",
    title: { es: "HaptMap", en: "HaptMap" },
    summary: {
      es: "HaptMap es una aplicación de navegación peatonal para smartwatch y web que utiliza patrones de vibración para guiar al usuario sin necesidad de mirar la pantalla. Integra evaluación inteligente de rutas, exploración de puntos de interés y funcionamiento autónomo.",
      en: "HaptMap is a pedestrian navigation application for smartwatch and web that uses vibration patterns to guide users without needing to look at the screen. It integrates smart route evaluation, point-of-interest exploration, and autonomous operation.",
    },
    description: [
      {
        es: "Desarrollada con una arquitectura modular y reactiva en tres semanas, combina seguimiento GPS en segundo plano, navegación háptica, almacenamiento local de rutas y modos de bajo consumo. Ofrece búsqueda por voz, rutas adaptativas y recomendaciones de puntos de interés.",
        en: "Built with a modular and reactive architecture in three weeks, it combines background GPS tracking, haptic navigation, local route storage, and low-power modes. It offers voice search, adaptive routing, and point-of-interest recommendations.",
      },
    ],
    type: "personal",
    role: { es: "Desarrollo Wear OS y web", en: "Wear OS & web development" },
    duration: { es: "3 semanas", en: "3 weeks" },
    status: "completed",
    device: "smartwatch",
    stack: ["Kotlin", "Wear OS", "Jetpack Compose", "Google Maps", "i18n"],
    features: [
      {
        es: "Guiado háptico: vibraciones diferenciadas para giros, desvíos, proximidad y llegada",
        en: "Haptic guidance: distinct vibration patterns for turns, detours, proximity, and arrival",
      },
      {
        es: "Modos Focus y Tour: rutas directas o exploración con evaluación de complejidad y sugerencias de puntos de interés",
        en: "Focus and Tour modes: direct routes or exploration with complexity evaluation and point-of-interest suggestions",
      },
      {
        es: "Búsqueda adaptativa: navegación por voz, categorías, mapa continuo y modos Eco/AOD",
        en: "Adaptive search: voice navigation, categories, continuous map, and Eco/AOD modes",
      },
      {
        es: "Autonomía: seguimiento GPS, persistencia local y recálculo automático de rutas",
        en: "Autonomy: GPS tracking, local persistence, and automatic route recalculation",
      },
      {
        es: "Personalización: tutorial háptico, configuración de alertas e interfaz en español e inglés",
        en: "Customization: haptic tutorial, alert settings, and interface in Spanish and English",
      },
    ],
    cover: "/assets/img/apps/app_reloj/img_reloj.webp",
    gallery: ["", "", ""], // TODO
    repoUrl: "",
    smartwatchUrl: "#", // TODO: enlace de descarga smartwatch
    demoUrl: "#", // TODO: enlace web
  },
];
