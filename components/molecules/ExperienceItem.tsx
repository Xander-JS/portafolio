import { Badge } from "@/components/atoms/Badge";
import { Icon } from "@/components/atoms/Icon";
import { Tag } from "@/components/atoms/Tag";
import type { IconName } from "@/data/types";

type Props = {
  icon: IconName;
  badge: string;
  title: string;
  place: string;
  period: string;
  summary?: string;
  skills?: string[];
  skillsLabel?: string;
  /** Solid red marker for the entry that matters most. */
  accent?: boolean;
};

/** One stop on the experience timeline: icon marker on the red track, type badge, role, place and period. */
export function ExperienceItem({ icon, badge, title, place, period, summary, skills, skillsLabel, accent = false }: Props) {
  return (
    <li className="experience-stop group relative grid grid-cols-[3rem_1fr] gap-x-5 pb-12 last:pb-0 md:gap-x-8">
      <span aria-hidden className="experience-track absolute top-14 bottom-2 left-6 w-0.5 -translate-x-1/2 rounded-full bg-primary/25 group-last:hidden" />
      <span
        aria-hidden
        className={`experience-marker grid size-12 place-items-center rounded-2xl ${accent ? "bg-primary text-primary-foreground" : "bg-primary-soft text-primary-soft-ink"}`}
      >
        <Icon name={icon} className="size-6" />
      </span>
      <div className="experience-copy rounded-2xl border border-black/15 bg-transparent p-7 shadow-[0_0_12px_rgba(0,0,0,0.08),0_4px_14px_-2px_rgba(0,0,0,0.16)] dark:border-white/15 dark:shadow-[0_0_12px_rgba(255,255,255,0.08),0_4px_14px_-2px_rgba(255,255,255,0.12)] md:p-9">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <Badge tone={accent ? "solid" : "soft"}>{badge}</Badge>
          <span className="text-sm font-medium text-primary-text">{period}</span>
        </div>
        <h3 className="mt-3 font-display text-2xl tracking-wide text-balance text-ink md:text-3xl">{title}</h3>
        <p className="mt-1 font-display text-base tracking-wide text-ink-soft">{place}</p>
        {summary && <p className="mt-4 max-w-[62ch] text-lg leading-relaxed text-ink">{summary}</p>}
        {skills && skills.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-2 list-none p-0 m-0" aria-label={skillsLabel}>
            {skills.map((s) => (
              <Tag key={s}>{s}</Tag>
            ))}
          </ul>
        )}
      </div>
    </li>
  );
}
