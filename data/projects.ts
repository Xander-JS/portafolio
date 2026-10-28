import type { Project } from "./types";

// The first project is shown large. Fill demoUrl / repoUrl; empty links are hidden.
export const projects: Project[] = [
  {
    id: "marketplace",
    image: "", // TODO: screenshot in /public, e.g. "/projects/marketplace.png"
    tags: ["Flutter", "Supabase", "i18n"],
    demoUrl: "", // TODO
    repoUrl: "", // TODO
  },
  // TODO: replace these placeholders with future projects (text in messages/*.json → projects.items.<id>)
  { id: "future1", image: "", tags: ["TODO"], demoUrl: "", repoUrl: "" },
  { id: "future2", image: "", tags: ["TODO"], demoUrl: "", repoUrl: "" },
  { id: "future3", image: "", tags: ["TODO"], demoUrl: "", repoUrl: "" },
];
