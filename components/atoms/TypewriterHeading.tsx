"use client";

import { useEffect, useState } from "react";

type Props = {
  text: string;
  speed?: number;
  className?: string;
};

/**
 * Renders text with a progressive typing animation and blinking tech cursor ('|').
 * Keyed by text so each new heading re-mounts and animates cleanly without cascading renders.
 */
export function TypewriterHeading({ text, speed = 28, className = "" }: Props) {
  const [displayed, setDisplayed] = useState("");
  const isTyping = displayed.length < text.length;

  useEffect(() => {
    // Respect reduced-motion: reveal the full heading at once instead of the per-character animation.
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const timeout = setTimeout(() => setDisplayed(text), 0);
      return () => clearTimeout(timeout);
    }

    let index = 0;
    const interval = setInterval(() => {
      index++;
      if (index <= text.length) {
        setDisplayed(text.slice(0, index));
      } else {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span className={`inline-block ${className}`}>
      {displayed}
      <span
        aria-hidden
        className={`ml-1.5 inline-block font-sans font-light text-primary select-none ${
          isTyping ? "opacity-100" : "typewriter-cursor"
        }`}
      >
        |
      </span>
    </span>
  );
}
