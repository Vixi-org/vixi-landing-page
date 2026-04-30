"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { CSSProperties } from "react";

interface FloatingDotProps {
  className?: string;
  style?: CSSProperties;
  /** Distance to drift, in pixels. Default 14. */
  amplitude?: number;
  /** Duration of one full loop, in seconds. Default 6. */
  duration?: number;
  /** Phase offset so multiple dots feel non-synchronised. Default 0. */
  delay?: number;
}

/**
 * Decorative dot with a subtle continuous floating motion. Drop into hero
 * sections to replace plain `<span>` decorations.
 *
 * Honours prefers-reduced-motion (renders static).
 */
export function FloatingDot({
  className,
  style,
  amplitude = 14,
  duration = 6,
  delay = 0,
}: FloatingDotProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <span className={className} style={style} aria-hidden />;
  }

  return (
    <motion.span
      className={className}
      style={style}
      aria-hidden
      animate={{ y: [0, -amplitude, 0, amplitude * 0.6, 0] }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}
