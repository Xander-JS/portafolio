import type { Testimonial } from "./types";

// Three slots. A slot with an empty name shows as "coming soon"; while all are empty the section shows one
// "coming soon" panel. For a video testimonial set type: "video" and videoUrl (YouTube/Vimeo embed URL or "/videos/x.mp4").
const empty = { es: "", en: "" };

export const testimonials: Testimonial[] = [
  // TODO: e.g. a professor
  { id: "t1", type: "text", name: "", role: empty, avatar: "", quote: empty, videoUrl: "" },
  // TODO: e.g. a teammate
  { id: "t2", type: "text", name: "", role: empty, avatar: "", quote: empty, videoUrl: "" },
  // TODO: e.g. the marketplace client
  { id: "t3", type: "video", name: "", role: empty, avatar: "", quote: empty, videoUrl: "" },
];
