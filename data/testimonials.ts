import type { Testimonial } from "./types";

// Three slots. A slot with an empty name shows as "coming soon"; while all are empty the section shows one
// "coming soon" panel. For a video testimonial set type: "video" and videoUrl (YouTube/Vimeo embed URL or "/videos/x.mp4").
export const testimonials: Testimonial[] = [
  {
    id: "t1",
    type: "text",
    name: "Andres Santiago Silva",
    role: { es: "Cliente", en: "Client" },
    avatar: "",
    quote: {
      es: "Me gustó mucho su compromiso con el proyecto. Siempre estuvo dispuesto a escuchar mis ideas, proponer soluciones y realizar los ajustes necesarios. El resultado fue una aplicación que cumplió con lo que necesitaba.",
      en: "I really liked his commitment to the project. He was always willing to listen to my ideas, propose solutions, and make the necessary adjustments. The result was an application that met everything I needed.",
    },
    videoUrl: "",
  },
  {
    id: "t2",
    type: "text",
    name: "Daniel Stiven Arteaga",
    role: { es: "Docente", en: "Teacher" },
    avatar: "",
    quote: {
      es: "Desde su etapa escolar demostró curiosidad por la tecnología y facilidad para aprender por su cuenta. Siempre buscaba ir un poco más allá de lo que se enseñaba en clase y encontrar nuevas formas de resolver problemas.",
      en: "Since his school years, he showed curiosity about technology and an aptitude for self-directed learning. He always looked to go a step beyond what was taught in class and find new ways to solve problems.",
    },
    videoUrl: "",
  },
  {
    id: "t3",
    type: "text",
    name: "Erik Santiago Lopez",
    role: { es: "Compañero", en: "Peer" },
    avatar: "",
    quote: {
      es: "Algo que siempre he destacado de él es que cuando se propone aprender algo, busca la manera de hacerlo. Le gusta experimentar con nuevas herramientas, compartir lo que descubre y ayudar cuando alguien tiene dificultades.",
      en: "Something I have always highlighted about him is that when he sets his mind to learning something, he finds a way to do it. He likes experimenting with new tools, sharing what he discovers, and helping whenever someone runs into difficulties.",
    },
    videoUrl: "",
  },
];
