"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

/** Clears the outgoing animation when the shared page frame receives a new route. */
export function ModuleTransitionReset() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const main = document.getElementById("main");
    main?.classList.remove(
      "module-leaving-forward",
      "module-leaving-pullback",
    );
  }, [pathname]);

  return null;
}
