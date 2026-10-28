import { Icon } from "@/components/atoms/Icon";
import type { Localized, PortfolioModule } from "@/data/types";

type Props = {
  module: PortfolioModule;
  side: "front" | "back";
  locale: keyof Localized;
  /** Staggers the background drift so neighbouring cards don't move in step. */
  index: number;
  className?: string;
};

/**
 * One face of a landscape module card. Front: tag, icon, short title, the guide's intersecting circles on a drifting
 * red gradient. Back: the same gradient darker, with the icon as a watermark. Decorative: the drum's link and panel carry
 * the words for assistive tech. Sizes follow the card's width (cqw), so it reads the same at every card size.
 */
export function ModuleCardFace({ module, side, locale, index, className = "" }: Props) {
  return (
    <div
      aria-hidden
      className={`module-face relative overflow-hidden rounded-2xl text-white ring-1 ring-white/10 ring-inset [container-type:inline-size] ${className}`}
    >
      <div className="module-bg" style={{ animationDelay: `${index * -2.7}s` }} />
      {side === "front" ? (
        <>
          <div className="relative flex h-full flex-col justify-between p-[7cqw]">
            <div className="flex items-start justify-between gap-4">
              <span className="rounded-full bg-white/15 px-[3.5cqw] py-[1.2cqw] text-[max(11px,3.6cqw)] font-medium">{module.label[locale]}</span>
              <span className="grid size-[13cqw] place-items-center rounded-[3.5cqw] bg-white text-primary-700">
                <Icon name={module.icon} className="size-[55%]" />
              </span>
            </div>
            <p className="max-w-[68%] text-[8cqw] leading-[1.05] font-medium tracking-[-0.025em] text-balance">{module.title[locale]}</p>
          </div>
          <div className="absolute right-[7cqw] bottom-[7cqw] flex -space-x-[3.5cqw]">
            <span className="size-[9cqw] rounded-full border border-white/15 bg-primary-300/30" />
            <span className="size-[9cqw] rounded-full border border-white/15 bg-primary-200/45" />
          </div>
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-primary-950/60" />
          <Icon name={module.icon} className="absolute -right-[6cqw] -bottom-[10cqw] size-[58cqw] text-white/[0.08]" />
          <div className="absolute top-[7cqw] left-[7cqw] flex -space-x-[3.5cqw]">
            <span className="size-[7cqw] rounded-full border border-white/10 bg-primary-400/20" />
            <span className="size-[7cqw] rounded-full border border-white/10 bg-primary-300/25" />
          </div>
          <p className="absolute bottom-[7cqw] left-[7cqw] text-[max(11px,3.6cqw)] font-medium text-white/60">{module.label[locale]}</p>
        </>
      )}
    </div>
  );
}
