import type { AcademicItem, Seminar, WorkItem } from "./types";

// Fill every TODO. The first work item is listed first.
export const work: WorkItem[] = [
  {
    id: "marketplace",
    kind: "freelance",
    icon: "briefcase",
    role: { es: "Desarrollo de apps móviles", en: "Mobile App Developer" },
    place: { es: "Freelance · Marketplace agrícola", en: "Freelance · Agricultural Marketplace" },
    period: { es: "2 meses", en: "2 months" }, // TODO: add the dates, e.g. "Mar – Abr 2025"
    summary: {
      es: "Diseñé y construí la app de principio a fin, por mi cuenta: tres roles (agricultor, comprador y moderador), base de datos en Supabase e interfaz bilingüe.",
      en: "Designed and built the app end to end on my own: three roles (farmer, buyer and moderator), a Supabase backend and a bilingual interface.",
    },
    skills: [
      { es: "Flutter", en: "Flutter" },
      { es: "Supabase", en: "Supabase" },
      { es: "Trato con el cliente", en: "Client communication" },
      { es: "Entregas a tiempo", en: "On-time delivery" },
    ],
  },
  {
    id: "restaurant",
    kind: "job",
    icon: "utensils",
    role: { es: "TODO: cargo en el restaurante", en: "TODO: restaurant role" },
    place: { es: "TODO: nombre del restaurante, ciudad", en: "TODO: restaurant name, city" },
    period: { es: "TODO: 2023 – 2024", en: "TODO: 2023 – 2024" },
    summary: {
      es: "Aprendí a atender bien a cada cliente, a trabajar en equipo y a responder con calma cuando había presión.",
      en: "I learned to serve every customer well, to work as a team and to stay calm under pressure.",
    },
    skills: [
      { es: "Atención al cliente", en: "Customer service" },
      { es: "Trabajo en equipo", en: "Teamwork" },
      { es: "Trabajo bajo presión", en: "Working under pressure" },
    ],
  },
  {
    id: "store",
    kind: "job",
    icon: "store",
    role: { es: "TODO: cargo en la tienda", en: "TODO: store role" },
    place: { es: "TODO: nombre de la tienda, ciudad", en: "TODO: store name, city" },
    period: { es: "TODO: 2022 – 2023", en: "TODO: 2022 – 2023" },
    summary: {
      es: "Aprendí a atender clientes, a mantener todo en orden y a responder por lo que tenía a cargo.",
      en: "I learned to serve customers, keep everything in order and own what I was responsible for.",
    },
    skills: [
      { es: "Atención al cliente", en: "Customer service" },
      { es: "Organización", en: "Organization" },
      { es: "Responsabilidad", en: "Responsibility" },
    ],
  },
];

export const academic: AcademicItem[] = [
  {
    id: "degree",
    title: { es: "Estudiante de Ingeniería de Software · 5.º semestre", en: "Software Engineering student · 5th semester" },
    place: { es: "TODO: nombre de la universidad", en: "TODO: university name" },
    period: { es: "TODO: 2023 – presente", en: "TODO: 2023 – present" },
    summary: {
      es: "Formación en desarrollo de software, diseño de interfaces y arquitectura de lenguajes de programación.",
      en: "Training in software development, interface design and programming language architecture.",
    },
  },
];

// TODO: one entry per seminar you attended. Delete the placeholders you don't need.
export const seminars: Seminar[] = [
  { id: "s1", name: { es: "TODO: nombre del seminario", en: "TODO: seminar name" }, topic: { es: "TODO: tema", en: "TODO: topic" }, date: "TODO: 2025-03" },
  { id: "s2", name: { es: "TODO: nombre del seminario", en: "TODO: seminar name" }, topic: { es: "TODO: tema", en: "TODO: topic" }, date: "TODO: 2025-05" },
  { id: "s3", name: { es: "TODO: nombre del seminario", en: "TODO: seminar name" }, topic: { es: "TODO: tema", en: "TODO: topic" }, date: "TODO: 2025-09" },
];
