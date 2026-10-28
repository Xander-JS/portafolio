// Typed content models. Interface text lives in messages/{es,en}.json; content text lives here as { es, en }.

/** A string in both site languages. */
export type Localized = { es: string; en: string };

export type IconName =
  | "flutter"
  | "supabase"
  | "nextjs"
  | "figma"
  | "claude"
  | "gemini"
  | "chatgpt"
  | "vscode"
  | "cursor"
  | "antigravity"
  | "claudecode"
  | "opencode"
  | "git"
  | "github"
  | "code"
  | "chat"
  | "team"
  | "languages"
  | "facebook"
  | "linkedin"
  | "mail"
  | "user"
  | "layers"
  | "folder"
  | "briefcase"
  | "quote"
  | "graduation"
  | "store"
  | "utensils"
  | "mic";

export type Social = { id: "facebook" | "linkedin"; href: string };

export type Profile = {
  name: string;
  email: string;
  city: string;
  university: string;
  /** Path under /public, e.g. "/me.jpg". Leave empty to show initials. */
  photo: string;
  socials: Social[];
};

/** Label comes from messages `skills.items.<id>`. */
export type Skill = { id: string; icon: IconName };
export type SkillGroup = {
  id: "technical" | "ai" | "editors" | "agents" | "vcs" | "soft" | "languages";
  skills: Skill[];
};

export type Project = {
  /** URL segment: /projects/<slug>. Images go in public/projects/<slug>/. */
  slug: string;
  title: Localized;
  /** One or two sentences for cards. */
  summary: Localized;
  /** Full text for the detail page; one entry per paragraph. */
  description: Localized[];
  type: "freelance" | "personal" | "academic";
  role: Localized;
  duration: Localized;
  status: "completed" | "inProgress" | "planned";
  stack: string[];
  features: Localized[];
  /** Path under /public. Empty shows the red placeholder. */
  cover: string;
  /** Paths under /public. Empty entries show placeholders. */
  gallery: string[];
  /** Empty links are hidden. */
  repoUrl: string;
  demoUrl: string;
};

export type WorkItem = {
  id: string;
  kind: "freelance" | "job";
  icon: IconName;
  role: Localized;
  place: Localized;
  period: Localized;
  summary: Localized;
  skills: Localized[];
};

export type AcademicItem = {
  id: string;
  title: Localized;
  place: Localized;
  period: Localized;
  summary: Localized;
};

export type Seminar = { id: string; name: Localized; topic: Localized; date: string };

export type Testimonial = {
  id: string;
  type: "text" | "video";
  /** Leave empty to keep the slot as "coming soon". */
  name: string;
  role: Localized;
  /** Path under /public. Empty shows initials. */
  avatar: string;
  /** For type "text". */
  quote: Localized;
  /** For type "video": a YouTube/Vimeo embed URL or a video file under /public. */
  videoUrl: string;
};

/**
 * One part of the portfolio. The single source for the drum card, the nav link, the home summary's heading and
 * intro, and the detail page at /<slug> (whose folder in app/ must match the slug).
 */
export type PortfolioModule = {
  id: "about" | "skills" | "projects" | "experience" | "testimonials" | "contact";
  slug: string;
  icon: IconName;
  /** Section name: nav link, card tag and section heading. */
  label: Localized;
  /** Short title on the card and in the drum panel. */
  title: Localized;
  /** Two or three lines: the drum panel and the section intro. */
  description: Localized;
  facts: Localized[];
};
