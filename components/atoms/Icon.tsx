import { Code2, Languages, Mail, MessagesSquare, Users } from "lucide-react";
import { siFacebook, siFigma, siFlutter, siNextdotjs, siSupabase } from "simple-icons";
import type { IconName } from "@/data/types";

const brands = { flutter: siFlutter, supabase: siSupabase, nextjs: siNextdotjs, figma: siFigma, facebook: siFacebook };
const generic = { code: Code2, chat: MessagesSquare, team: Users, languages: Languages, mail: Mail };

/** Decorative by default; the label next to it carries the meaning. */
export function Icon({ name, className = "size-6" }: { name: IconName; className?: string }) {
  if (name === "linkedin") {
    // simple-icons no longer ships LinkedIn, so this is a plain "in" mark.
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
        <path d="M4 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4Zm-1.8 6h3.6v12H2.2V9Zm6 0h3.4v1.7c.5-.9 1.7-2 3.6-2 3.8 0 4.5 2.5 4.5 5.8V21h-3.6v-5.8c0-1.4 0-3.2-2-3.2s-2.3 1.5-2.3 3.1V21H8.2V9Z" />
      </svg>
    );
  }
  if (name in brands) {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
        <path d={brands[name as keyof typeof brands].path} />
      </svg>
    );
  }
  const Generic = generic[name as keyof typeof generic];
  return <Generic className={className} aria-hidden strokeWidth={1.6} />;
}
