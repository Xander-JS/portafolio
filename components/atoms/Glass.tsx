import type { ComponentPropsWithRef, ElementType } from "react";

type Props<T extends ElementType> = { as?: T; interactive?: boolean } & ComponentPropsWithRef<T>;

/** A static piece of smoked glass. `interactive` lifts it and adds the iridescent sheen on hover. */
export function Glass<T extends ElementType = "div">({ as, interactive, className = "", ...props }: Props<T>) {
  const Tag = as ?? "div";
  return <Tag className={`glass ${interactive ? "glass-hover" : ""} ${className}`} {...props} />;
}
