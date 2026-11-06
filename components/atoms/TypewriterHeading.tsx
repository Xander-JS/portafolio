"use client";

import { useEffect, useState } from "react";

type Props = {
  text: string;
  speed?: number;
  className?: string;
};

/**
 * Renders text with a progressive typing animation and blinking tech cursor ('|').
 * Restarts smoothly when `text` changes across sections.
 */
export function TypewriterHeading({ text, speed = 28, className = "" }: Props) {
  const [displayed, setDisplayed] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    setDisplayed("");
    setIsTyping(true);

    let index = 0;
    const interval = setInterval(() => {
      index++;
      if (index <= text.length) {
        setDisplayed(text.slice(0, index));
      } else {
        setIsTyping(false);
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
