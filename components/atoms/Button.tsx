import type { ComponentProps } from "react";

const styles = {
  // Light pill that turns green on hover (promt-guide.md, "Open studio").
  pill: "inline-flex h-11 items-center justify-center rounded-md bg-pill px-5 text-sm font-medium text-pill-ink transition-colors duration-200 hover:bg-[#36d67e] hover:text-[#050507] active:scale-[0.98]",
  // Text link that underlines on hover ("Read paper →").
  link: "inline-flex h-11 items-center text-sm font-medium text-ink underline decoration-transparent underline-offset-4 transition-[text-decoration-color] duration-200 hover:decoration-current",
};

type Variant = keyof typeof styles;

export function ButtonLink({ variant = "pill", className = "", ...props }: ComponentProps<"a"> & { variant?: Variant }) {
  return <a data-hit={variant === "pill" ? "primary" : "link"} className={`${styles[variant]} ${className}`} {...props} />;
}

export function Button({ variant = "pill", className = "", ...props }: ComponentProps<"button"> & { variant?: Variant }) {
  return (
    <button data-hit={variant === "pill" ? "primary" : "link"} className={`${styles[variant]} cursor-pointer ${className}`} {...props} />
  );
}
