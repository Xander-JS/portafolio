import type { SkillGroup } from "./types";

export const skillGroups: SkillGroup[] = [
  {
    id: "technical",
    skills: [
      { id: "flutter", icon: "flutter" },
      { id: "supabase", icon: "supabase" },
      { id: "nextjs", icon: "nextjs" },
      { id: "figma", icon: "figma" },
      { id: "languagesArch", icon: "code" },
    ],
  },
  {
    id: "soft",
    skills: [
      { id: "communication", icon: "chat" },
      { id: "teamwork", icon: "team" },
    ],
  },
  {
    id: "languages",
    skills: [
      { id: "spanish", icon: "languages" },
      { id: "english", icon: "languages" },
    ],
  },
];
