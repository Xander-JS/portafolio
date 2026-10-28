import {
  Bot,
  Briefcase,
  Code2,
  FolderOpen,
  GraduationCap,
  Languages,
  Layers,
  Mail,
  MessagesSquare,
  Mic,
  Orbit,
  Quote,
  SquareCode,
  Store,
  User,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import {
  siClaude,
  siClaudecode,
  siCursor,
  siFacebook,
  siFigma,
  siFlutter,
  siGit,
  siGithub,
  siGooglegemini,
  siNextdotjs,
  siOpencode,
  siSupabase,
} from "simple-icons";
import type { IconName } from "@/data/types";

const brands = {
  flutter: siFlutter,
  supabase: siSupabase,
  nextjs: siNextdotjs,
  figma: siFigma,
  facebook: siFacebook,
  claude: siClaude,
  gemini: siGooglegemini,
  cursor: siCursor,
  claudecode: siClaudecode,
  opencode: siOpencode,
  git: siGit,
  github: siGithub,
};
// simple-icons does not ship these marks, so a generic glyph in the brand colour stands in.
// TODO: paste the official SVG <path d> of ChatGPT, VS Code and Antigravity here if you want the real logos.
const standIns = {
  chatgpt: { Glyph: Bot, hex: "10A37F" },
  vscode: { Glyph: SquareCode, hex: "007ACC" },
  antigravity: { Glyph: Orbit, hex: "4285F4" },
};
const generic = {
  code: Code2,
  chat: MessagesSquare,
  team: Users,
  languages: Languages,
  mail: Mail,
  user: User,
  layers: Layers,
  folder: FolderOpen,
  briefcase: Briefcase,
  quote: Quote,
  graduation: GraduationCap,
  store: Store,
  utensils: UtensilsCrossed,
  mic: Mic,
};

/** Decorative by default; the label next to it carries the meaning. `colored` paints brand marks in their brand colour. */
export function Icon({ name, className = "size-6", colored = false }: { name: IconName; className?: string; colored?: boolean }) {
  if (name === "linkedin") {
    // simple-icons no longer ships LinkedIn, so this is a plain "in" mark.
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
        <path d="M4 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4Zm-1.8 6h3.6v12H2.2V9Zm6 0h3.4v1.7c.5-.9 1.7-2 3.6-2 3.8 0 4.5 2.5 4.5 5.8V21h-3.6v-5.8c0-1.4 0-3.2-2-3.2s-2.3 1.5-2.3 3.1V21H8.2V9Z" />
      </svg>
    );
  }
  if (name in brands) {
    const icon = brands[name as keyof typeof brands];
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor" style={colored ? { color: `#${icon.hex}` } : undefined}>
        <path d={icon.path} />
      </svg>
    );
  }
  if (name in standIns) {
    const { Glyph, hex } = standIns[name as keyof typeof standIns];
    return <Glyph className={className} aria-hidden strokeWidth={1.8} style={colored ? { color: `#${hex}` } : undefined} />;
  }
  const Generic = generic[name as keyof typeof generic];
  return <Generic className={className} aria-hidden strokeWidth={1.6} />;
}
