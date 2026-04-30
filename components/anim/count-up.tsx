"use client";

import { animate, useInView, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

interface CountUpProps {
  /** Final value to count up to. */
  to: number;
  /** Duration in seconds. Default 1.6. */
  duration?: number;
  /** String to append after the number, e.g. "%" or "x". */
  suffix?: string;
  /** Decimal places to display. Default 0. */
  decimals?: number;
}

/**
 * Animated number counter that triggers when the element scrolls into view.
 * Replaces the `Odometer`-style effect from the original site.
 *
 * Honours prefers-reduced-motion (jumps straight to final value).
 */
export function CountUp({
  to,
  duration = 1.6,
  suffix = "",
  decimals = 0,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const reduced = useReducedMotion();
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) =>
    latest.toFixed(decimals),
  );

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      count.set(to);
      return;
    }
    const controls = animate(count, to, { duration, ease: "easeOut" });
    return () => controls.stop();
  }, [count, duration, inView, reduced, to]);

  return (
    <span ref={ref} aria-label={`${to}${suffix}`}>
      <CountValue rounded={rounded} />
      {suffix}
    </span>
  );
}

function CountValue({ rounded }: { rounded: ReturnType<typeof useTransform<number, string>> }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    return rounded.on("change", (latest) => {
      if (ref.current) ref.current.textContent = latest;
    });
  }, [rounded]);

  return <span ref={ref}>{rounded.get()}</span>;
}
