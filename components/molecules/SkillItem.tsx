import { Icon } from "@/components/atoms/Icon";
import type { IconName } from "@/data/types";

// The logo sits on a white chip in both themes, so dark marks (Next.js, GitHub, Cursor) stay visible on dark mode.
const chip = "grid shrink-0 place-items-center rounded-xl bg-white text-primary-700 shadow-[0_1px_3px_rgb(0_0_0/0.1)]";

export function SkillItem({ icon, label, compact = false }: { icon: IconName; label: string; compact?: boolean }) {
  if (compact) {
    return (
      <li className="flex items-center gap-2.5 rounded-xl bg-surface py-1.5 pr-4 pl-1.5">
        <span className={`${chip} size-9 rounded-lg`}>
          <Icon name={icon} colored className="size-5" />
        </span>
        <span className="text-sm font-medium text-ink">{label}</span>
      </li>
    );
  }
  return (
    <li className="flex flex-col items-start gap-6 rounded-2xl bg-surface p-5 transition-colors duration-200 hover:bg-primary-soft">
      <span className={`${chip} size-12`}>
        <Icon name={icon} colored className="size-7" />
      </span>
      <span className="text-base font-medium text-ink">{label}</span>
    </li>
  );
}
