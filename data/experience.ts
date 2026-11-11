import type { AcademicItem, Seminar, WorkItem } from "./types";

export const work: WorkItem[] = [
  {
    id: "restaurant",
    kind: "job",
    icon: "utensils",
    role: { es: "Atención al cliente y servicio de mesa", en: "Customer Service & Table Service" },
    place: { es: "Restaurante Alcatraz · Delicias del Mar", en: "Restaurante Alcatraz · Delicias del Mar" },
    period: { es: "2025 – Actualidad", en: "2025 – Present" },
    summary: {
      es: "Desempeño funciones de atención al cliente y servicio de mesa, además de apoyar en actividades de caja, registros contables básicos, organización y mantenimiento del establecimiento. Esta experiencia ha fortalecido mi responsabilidad, capacidad de adaptación y trabajo en equipo.",
      en: "I perform customer service and table service duties, while also supporting cashier operations, basic accounting records, organization, and maintenance of the establishment. This experience has strengthened my responsibility, adaptability, and teamwork.",
    },
    skills: [
      { es: "Atención al cliente", en: "Customer service" },
      { es: "Trabajo en equipo", en: "Teamwork" },
      { es: "Organización", en: "Organization" },
      { es: "Responsabilidad", en: "Responsibility" },
    ],
  },
  {
    id: "store",
    kind: "job",
    icon: "store",
    role: { es: "Atención al cliente y apoyo comercial", en: "Customer Service & Store Support" },
    place: { es: "Tienda Doña María", en: "Tienda Doña María" },
    period: { es: "2018 – 2020", en: "2018 – 2020" },
    summary: {
      es: "Trabajé en un establecimiento comercial de barrio, brindando atención directa a los clientes y apoyando las actividades cotidianas del negocio. Esta experiencia me permitió desarrollar habilidades de comunicación, responsabilidad y trato con las personas.",
      en: "I worked in a neighborhood retail store, providing direct customer service and supporting day-to-day business operations. This experience helped me develop communication skills, responsibility, and interpersonal skills.",
    },
    skills: [
      { es: "Comunicación", en: "Communication" },
      { es: "Atención al cliente", en: "Customer service" },
      { es: "Responsabilidad", en: "Responsibility" },
    ],
  },
];

export const academic: AcademicItem[] = [
  {
    id: "degree",
    title: { es: "Ingeniería de Software · 5.º semestre", en: "Software Engineering · 5th semester" },
    place: { es: "Universidad Cooperativa de Colombia", en: "Universidad Cooperativa de Colombia" },
    period: { es: "En curso", en: "In progress" },
    summary: {
      es: "Actualmente curso el quinto semestre de Ingeniería de Software, donde he adquirido conocimientos en programación, arquitectura de software, bases de datos y diseño de sistemas, aplicándolos en el desarrollo de proyectos tecnológicos.",
      en: "I am currently in the fifth semester of Software Engineering, where I have gained knowledge in programming, software architecture, databases, and systems design, applying it to the development of technological projects.",
    },
    skills: [
      { es: "Programación", en: "Programming" },
      { es: "Arquitectura de software", en: "Software architecture" },
      { es: "Bases de datos", en: "Databases" },
      { es: "Desarrollo de aplicaciones", en: "Application development" },
    ],
  },
  {
    id: "independent",
    title: { es: "Proyectos académicos y desarrollo independiente", en: "Academic projects & independent development" },
    place: { es: "Desarrollo web, móvil e IA aplicada", en: "Web, mobile & applied AI development" },
    period: { es: "En curso", en: "Ongoing" },
    summary: {
      es: "He desarrollado aplicaciones web y móviles utilizando diferentes lenguajes, frameworks y sistemas de bases de datos. Complemento mis conocimientos con herramientas de inteligencia artificial para mejorar mis procesos de desarrollo, explorar nuevas tecnologías y construir soluciones funcionales.",
      en: "I have built web and mobile applications using different languages, frameworks, and database systems. I complement my skills with artificial intelligence tools to improve my development workflows, explore new technologies, and build functional solutions.",
    },
  },
];

export const seminars: Seminar[] = [];
