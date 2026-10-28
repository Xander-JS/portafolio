// Typed content models. Every visible sentence lives in messages/{es,en}.json under the same id.

export type IconName =
  | "flutter"
  | "supabase"
  | "nextjs"
  | "figma"
  | "code"
  | "chat"
  | "team"
  | "languages"
  | "facebook"
  | "linkedin"
  | "mail";

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
export type SkillGroup = { id: "technical" | "soft" | "languages"; skills: Skill[] };

/** Name and description come from messages `projects.items.<id>`. */
export type Project = {
  id: string;
  /** Path under /public. Leave empty to show the drawn placeholder. */
  image: string;
  tags: string[];
  demoUrl: string;
  repoUrl: string;
};

/** Role and summary come from messages `experience.items.<id>`; skills from `experience.skills.<key>`. */
export type Experience = {
  id: string;
  place: string;
  period: string;
  skills: ("service" | "teamwork" | "responsibility" | "pressure")[];
};

/** Role and quote come from messages `testimonials.items.<id>`. */
export type Testimonial = { id: string; name: string; photo: string };
