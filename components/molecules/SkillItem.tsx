import { Glass } from "@/components/atoms/Glass";
import { Icon } from "@/components/atoms/Icon";
import type { IconName } from "@/data/types";

export function SkillItem({ icon, label }: { icon: IconName; label: string }) {
  return (
    <Glass as="li" interactive className="flex flex-col items-start gap-6 p-5">
      <Icon name={icon} className="size-8 text-ink" />
      <span className="text-base font-medium text-ink">{label}</span>
    </Glass>
  );
}
