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
    <li className="group relative grid grid-cols-[3rem_1fr] gap-x-5 pb-12 last:pb-0 md:gap-x-8">
      <span aria-hidden className="absolute top-14 bottom-2 left-6 w-0.5 -translate-x-1/2 rounded-full bg-primary/25 group-last:hidden" />
      <span
        aria-hidden
        className={`grid size-12 place-items-center rounded-2xl ${accent ? "bg-primary text-primary-foreground" : "bg-primary-soft text-primary-soft-ink"}`}
      >
        <Icon name={icon} className="size-6" />
      </span>
      <div className="pt-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <Badge tone={accent ? "solid" : "soft"}>{badge}</Badge>
          <span className="text-sm font-medium text-primary-text">{period}</span>
        </div>
        <h3 className="mt-3 text-2xl font-medium tracking-[-0.025em] text-balance text-ink md:text-3xl">{title}</h3>
        <p className="mt-1 text-base text-ink-soft">{place}</p>
        {summary && <p className="mt-4 max-w-[62ch] text-lg leading-relaxed text-ink">{summary}</p>}
        {skills && skills.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-2" aria-label={skillsLabel}>
            {skills.map((s) => (
              <Tag key={s}>{s}</Tag>
            ))}
          </ul>
        )}
      </div>
    </li>
  );
}
