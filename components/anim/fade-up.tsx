"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

interface FadeUpProps {
  children: ReactNode;
  delay?: number;
  /** Distance the element travels up, in pixels. Default 24. */
  distance?: number;
  /** Animation duration in seconds. Default 0.6. */
  duration?: number;
  /** Fraction of element that must be visible before animating. Default 0.2. */
  amount?: number;
  /** When true, animates only the first time it enters view. Default true. */
  once?: boolean;
  /** Optional className passthrough so the wrapper inherits layout styles. */
  className?: string;
  /** Render as a different HTML element. Default "div". */
  as?: "div" | "section" | "li" | "ul" | "article" | "span";
}

/**
 * Wraps server-rendered children with a fade + slide-up entrance animation
 * triggered when the element scrolls into view. The wrapper itself is a
 * client component, but its children stay server-rendered.
 *
 * Honours prefers-reduced-motion automatically.
 */
export function FadeUp({
  children,
  delay = 0,
  distance = 24,
  duration = 0.6,
  amount = 0.2,
  once = true,
  className,
  as = "div",
}: FadeUpProps) {
  const reduced = useReducedMotion();
  const Tag = motion[as] as typeof motion.div;

  if (reduced) {
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Tag>
  );
}
