"use client";

import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

// Horizontal course rail with click-to-scroll arrows instead of a visible
// scrollbar. The scroll container is still natively scrollable (trackpad /
// swipe keep working), but the bar is hidden and the left/right sticker
// buttons drive navigation. Buttons auto-disable at each end and hide
// entirely when the content fits without scrolling.
//
// Client component because arrow state (canScrollLeft/Right) and the
// scrollBy() calls need the DOM + effects. Children are server-rendered
// cards passed straight through.
export function ArrowCarousel({
  children,
  className,
  scrollClassName,
  ariaLabel,
}: {
  children: ReactNode;
  // Applied to the outer relative wrapper (lets callers control negative
  // margins / horizontal padding so the rail bleeds the same way it did
  // before, while the arrows sit inside the padded area).
  className?: string;
  // Applied to the inner scroll row (gap, padding, snap behavior).
  scrollClassName?: string;
  ariaLabel?: string;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const update = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    // 2px slack so sub-pixel rounding at the ends doesn't leave a button
    // stuck in the enabled state.
    setCanLeft(scrollLeft > 2);
    setCanRight(scrollLeft < scrollWidth - clientWidth - 2);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [update]);

  const scrollByPage = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    // Scroll by ~85% of the visible width so a card or two stays in view as
    // an anchor between pages.
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  const showArrows = canLeft || canRight;

  return (
    <div className={cn("relative", className)}>
      <div
        ref={scrollerRef}
        aria-label={ariaLabel}
        className={cn(
          "flex overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          // Mobile-only right-edge fade while a card peeks off the right.
          canRight && "rail-fade-right",
          scrollClassName,
        )}
      >
        {children}
      </div>

      {/* Desktop: arrows float over the rail's left/right edges. */}
      <CarouselArrow
        side="left"
        disabled={!canLeft}
        onClick={() => scrollByPage(-1)}
      />
      <CarouselArrow
        side="right"
        disabled={!canRight}
        onClick={() => scrollByPage(1)}
      />

      {/* Mobile: a stable left/right pair tucked into the lower-right corner,
          below the rail. Swipe still works — these are just the obvious tap
          target on touch. Hidden entirely when everything fits without
          scrolling. */}
      {showArrows && (
        <div className="mt-3 flex justify-end gap-2 pr-4 md:hidden">
          <CornerArrow
            side="left"
            disabled={!canLeft}
            onClick={() => scrollByPage(-1)}
          />
          <CornerArrow
            side="right"
            disabled={!canRight}
            onClick={() => scrollByPage(1)}
          />
        </div>
      )}
    </div>
  );
}

// Round sticker button that floats over the rail's left/right edge. Same
// border-2 + hard-shadow language as the rest of the homepage so it reads as
// a Vixi control. Hidden on touch-first small screens (swipe is more natural
// there) and fades out when there's nothing more to scroll toward.
function CarouselArrow({
  side,
  disabled,
  onClick,
}: {
  side: "left" | "right";
  disabled: boolean;
  onClick: () => void;
}) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={side === "left" ? "Scroll left" : "Scroll right"}
      className={cn(
        "absolute top-1/2 z-10 hidden -translate-y-1/2 cursor-pointer select-none md:inline-flex",
        "h-11 w-11 items-center justify-center rounded-full",
        "border-2 border-card-foreground bg-background text-card-foreground",
        "shadow-[3px_3px_0_0_rgb(74,50,111)]",
        "transition-all duration-150 ease-out",
        "hover:translate-x-[1.5px] hover:translate-y-[calc(-50%+1.5px)] hover:shadow-[1.5px_1.5px_0_0_rgb(74,50,111)]",
        "active:translate-x-[3px] active:translate-y-[calc(-50%+3px)] active:shadow-[0_0_0_0_rgb(74,50,111)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2",
        side === "left" ? "-left-3 lg:-left-5" : "-right-3 lg:-right-5",
        disabled && "pointer-events-none opacity-0",
      )}
    >
      <Icon className="size-5" aria-hidden />
    </button>
  );
}

// In-flow sticker button used for the mobile corner pair. Same Vixi control
// language as CarouselArrow, but it sits in the normal flow (lower-right of the
// rail) rather than floating over the edges. Disabled ends stay visible at low
// opacity so the pair never shifts the layout as you scroll.
function CornerArrow({
  side,
  disabled,
  onClick,
}: {
  side: "left" | "right";
  disabled: boolean;
  onClick: () => void;
}) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={side === "left" ? "Scroll left" : "Scroll right"}
      className={cn(
        "inline-flex h-11 w-11 shrink-0 cursor-pointer select-none items-center justify-center rounded-full",
        "border-2 border-card-foreground bg-background text-card-foreground",
        "shadow-[3px_3px_0_0_rgb(74,50,111)]",
        "transition-all duration-150 ease-out",
        "active:translate-x-[3px] active:translate-y-[3px] active:shadow-[0_0_0_0_rgb(74,50,111)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2",
        disabled && "pointer-events-none opacity-40",
      )}
    >
      <Icon className="size-5" aria-hidden />
    </button>
  );
}
