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
    id: "ai",
    skills: [
      { id: "claude", icon: "claude" },
      { id: "gemini", icon: "gemini" },
      { id: "chatgpt", icon: "chatgpt" },
    ],
  },
  {
    id: "editors",
    skills: [
      { id: "vscode", icon: "vscode" },
      { id: "cursor", icon: "cursor" },
      { id: "antigravity", icon: "antigravity" },
    ],
  },
  {
    id: "agents",
    skills: [
      { id: "claudecode", icon: "claudecode" },
      { id: "opencode", icon: "opencode" },
    ],
  },
  {
    id: "vcs",
    skills: [
      { id: "git", icon: "git" },
      { id: "github", icon: "github" },
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

/** The groups that are tools, shown as a logo strip on the home page. */
export const toolGroups = skillGroups.filter((g) => g.id !== "soft" && g.id !== "languages");
