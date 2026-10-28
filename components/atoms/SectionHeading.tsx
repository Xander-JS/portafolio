import { ArrowRight } from "lucide-react";
import Link from "next/link";

type Props = {
  id: string;
  title: string;
  intro?: string;
  /** The heading is the page title (h1) on detail pages. */
  level?: 1 | 2;
  /** Summary on the home page: a "View more" link to the detail page. */
  more?: { href: string; label: string; srLabel: string };
};

export function SectionHeading({ id, title, intro, level = 2, more }: Props) {
  const H = level === 1 ? "h1" : "h2";
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-x-10 gap-y-4 md:mb-14">
      <div className="max-w-2xl">
        <H id={id} className="text-4xl font-medium tracking-[-0.035em] text-balance text-ink md:text-6xl">
          <span aria-hidden className="mb-5 block h-1.5 w-12 rounded-full bg-primary" />
          {title}
        </H>
        {intro && <p className="mt-4 text-lg leading-relaxed text-ink-soft">{intro}</p>}
      </div>
      {more && (
        <Link
          href={more.href}
          aria-label={more.srLabel}
          className="group inline-flex h-11 items-center gap-2 rounded-md bg-primary-soft px-4 text-sm font-medium text-primary-soft-ink transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          {more.label}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </Link>
      )}
    </div>
  );
}
