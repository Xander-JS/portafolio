import Link from "next/link";
import type { ComponentProps } from "react";

const styles = {
  // Solid red: the one main action of a block.
  primary:
    "inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors duration-200 hover:bg-primary-hover active:scale-[0.98]",
  // Ink pill that turns red on hover (promt-guide.md, "Open studio").
  pill: "inline-flex h-11 items-center justify-center gap-2 rounded-md bg-pill px-5 text-sm font-medium text-pill-ink transition-colors duration-200 hover:bg-primary hover:text-primary-foreground active:scale-[0.98]",
  // Text link that underlines on hover ("Read paper →").
  link: "inline-flex h-11 items-center gap-1.5 text-sm font-medium text-primary-text underline decoration-transparent underline-offset-4 transition-[text-decoration-color] duration-200 hover:decoration-current",
};

type Variant = keyof typeof styles;

export function ButtonLink({ variant = "pill", className = "", ...props }: ComponentProps<"a"> & { variant?: Variant }) {
  return <a data-hit={variant} className={`${styles[variant]} ${className}`} {...props} />;
}

/** Same looks as ButtonLink, for routes inside the site. */
export function ButtonNavLink({ variant = "pill", className = "", ...props }: ComponentProps<typeof Link> & { variant?: Variant }) {
  return <Link data-hit={variant} className={`${styles[variant]} ${className}`} {...props} />;
}

export function Button({ variant = "pill", className = "", ...props }: ComponentProps<"button"> & { variant?: Variant }) {
  return <button data-hit={variant} className={`${styles[variant]} cursor-pointer ${className}`} {...props} />;
}
