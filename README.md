# Portafolio — Diseño de Interfaces

Personal portfolio built with Next.js 16 (App Router), TypeScript and Tailwind CSS 4. The visual direction follows `promt-guide.md`: smoked-glass shards on black. The hero and the contact form are cut into pieces that tilt toward the mouse, lift on hover, and (in the contact form) shatter when you send.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build (what Vercel runs)
node --test lib/shards.test.ts   # self-check for the shard geometry
```

Deploy: push to GitHub and import the repo in Vercel. No environment variables are needed.

## Fill in your content

Search the project for `TODO`: every placeholder contains it.

| What | Where |
| --- | --- |
| Name, email, city, university, photo, Facebook / LinkedIn | `data/profile.ts` |
| Skills (icons and order) | `data/skills.ts` |
| Projects: image, tags, demo and repo URLs | `data/projects.ts` |
| Jobs: place and dates | `data/experience.ts` |
| Testimonials: name and photo (delete all to hide the section) | `data/testimonials.ts` |
| **All text**, in both languages | `messages/es.json` and `messages/en.json` |

Every item in `data/*.ts` has an `id`. Its text lives in the translation files under the same id, e.g. project `marketplace` → `projects.items.marketplace.name` / `.description`. To add a project, add an entry in `data/projects.ts` and its text in **both** JSON files. Images go in `public/` and are referenced as `"/my-image.png"`. Empty demo/repo URLs are hidden automatically.

The types for all of this are in `data/types.ts`.

## Languages

- Spanish is the default; the `ES / EN` button switches languages instantly and remembers the choice (localStorage).
- Translations: `messages/es.json`, `messages/en.json` (same keys in both).
- Logic: `i18n/Providers.tsx` (uses `next-intl` on the client, so the page stays fully static).

## Theme (light / dark)

- `next-themes` follows the system preference and remembers the user's choice, with no flash on load.
- Colors are CSS variables at the top of `app/globals.css`: `:root` is light, `.dark` is dark. Change them there; components only use the tokens (`bg-ground`, `text-ink`, `text-ink-soft`, …).
- The glass look (`.glass`, `.glass-hover`) is also defined in `app/globals.css`.

## Structure (Atomic Design)

```
app/page.tsx              assembles the sections in order
components/
  atoms/                  Button, Glass, Icon, Tag, Avatar, Section, SectionHeading
  molecules/              ShardPanel (the glass effect), ProjectCard, SkillItem, ExperienceItem,
                          TestimonialCard, SocialLinks, LanguageToggle, ThemeToggle
  organisms/              Header, Hero, About, Skills, Projects, Experience, Testimonials, Contact, Footer
  templates/              PortfolioTemplate (header + main + footer)
data/                     typed content
messages/                 translations
lib/shards.ts             cut patterns and geometry for the shard panels
```

## Contact form

There is no backend. Sending opens the visitor's email app with the message filled in (`mailto:` to the email in `data/profile.ts`), and the glass breaks. For delivery without an email app, swap the `submit` function in `components/organisms/Contact.tsx` for a form service (Formspree, Resend, …).
