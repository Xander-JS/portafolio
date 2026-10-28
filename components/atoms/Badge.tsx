const tones = {
  solid: "bg-primary text-primary-foreground",
  soft: "bg-primary-soft text-primary-soft-ink",
  neutral: "bg-ink/[0.07] text-ink-soft",
};

/** A short type or status label, e.g. "Freelance" or "In progress". */
export function Badge({ children, tone = "soft" }: { children: string; tone?: keyof typeof tones }) {
  return <span className={`inline-flex h-7 items-center rounded-full px-3 text-xs font-medium ${tones[tone]}`}>{children}</span>;
}
