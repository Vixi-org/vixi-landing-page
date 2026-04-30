import { Slot } from "radix-ui";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

interface CtaProps extends Omit<ComponentProps<"button">, "type"> {
  /** Optional override of the button type. Default `"button"`. */
  type?: "button" | "submit" | "reset";
  /** When true, render as the child element (Slot pattern). Use to wrap a Next/Link or an external anchor. */
  asChild?: boolean;
  /** Padding/font scale. Default `"md"`. */
  size?: "sm" | "md" | "lg";
  children: ReactNode;
}

/**
 * Site-wide primary call-to-action button — the V4 winner from the
 * 3D-button A/B test (hard purple offset shadow, slides toward shadow
 * on hover, fully sinks on press).
 *
 * Usage:
 *   <Cta asChild><Link href="/contact">Schedule a demo</Link></Cta>
 *   <Cta asChild><a href="mailto:hello@vixiai.co">Email us</a></Cta>
 *   <Cta type="submit">Get started</Cta>
 *
 * Reserved for primary in-page CTAs. The header utility buttons
 * (Login, See a demo in the nav) keep their lighter rounded-full pill
 * style — V4's hard offset shadow would compete with the sticky header
 * on scroll.
 */
export function Cta({
  asChild,
  size = "md",
  type = "button",
  className,
  children,
  ...rest
}: CtaProps) {
  const Comp = asChild ? Slot.Root : "button";

  const sizeClasses = {
    sm: "px-5 py-2 text-sm",
    md: "px-7 py-3 text-base",
    lg: "px-8 py-3.5 text-base",
  }[size];

  return (
    <Comp
      // `type` lives on the underlying `<button>` only when not asChild —
      // Slot.Root doesn't accept it, so we conditionally spread.
      {...(asChild ? rest : { type, ...rest })}
      className={cn(
        "inline-flex items-center justify-center select-none",
        "rounded-2xl border-2 border-card-foreground",
        "bg-secondary font-semibold text-secondary-foreground",
        "shadow-[4px_4px_0_0_rgb(74,50,111)]",
        "transition-all duration-150 ease-out",
        "hover:translate-x-[2px] hover:translate-y-[2px]",
        "hover:shadow-[2px_2px_0_0_rgb(74,50,111)]",
        "active:translate-x-[4px] active:translate-y-[4px]",
        "active:shadow-[0_0_0_0_rgb(74,50,111)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-60",
        sizeClasses,
        className,
      )}
    >
      {children}
    </Comp>
  );
}
