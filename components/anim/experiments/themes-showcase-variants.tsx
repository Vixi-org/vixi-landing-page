"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

import {
  SHOWCASE_THEMES,
  ThemeTile,
  type ShowcaseTheme,
} from "@/components/anim/experiments/themes-showcase-tiles";
import { cn } from "@/lib/utils";

/* ============================================================ */
/*  V1 — Auto-rotating 3D card stack                            */
/* ============================================================ */

export function ThemesShowcaseV1() {
  const [order, setOrder] = useState<ShowcaseTheme[]>([...SHOWCASE_THEMES]);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (paused || reduced) return;
    const id = setInterval(() => {
      setOrder((prev) => {
        const [first, ...rest] = prev;
        return [...rest, first];
      });
    }, 2400);
    return () => clearInterval(id);
  }, [paused, reduced]);

  return (
    <div
      className="relative mx-auto flex aspect-[4/3] w-full max-w-md items-center justify-center"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="relative h-full w-44 [perspective:1000px] md:w-56"
        style={{ transformStyle: "preserve-3d" }}
      >
        {order.map((theme, i) => {
          const z = order.length - i;
          return (
            <motion.div
              key={theme.id}
              className="absolute inset-0"
              animate={{
                x: i * 22,
                y: i * 14,
                rotate: i * 4 - 6,
                scale: 1 - i * 0.05,
                opacity: 1 - i * 0.18,
                zIndex: z,
              }}
              transition={{ type: "spring", stiffness: 220, damping: 26 }}
            >
              <ThemeTile theme={theme} className="h-full w-full" />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================ */
/*  V2 — Floating mosaic 2x2 with hover-bring-to-front          */
/* ============================================================ */

export function ThemesShowcaseV2() {
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="relative mx-auto grid aspect-[4/3] w-full max-w-md grid-cols-2 grid-rows-2 gap-4 p-2">
      {SHOWCASE_THEMES.map((theme, i) => {
        const tilt = [-3, 2, 2, -2][i] ?? 0;
        return (
          <motion.div
            key={theme.id}
            className="relative"
            initial={{ rotate: tilt, y: 0 }}
            animate={
              reduced
                ? { rotate: tilt }
                : {
                    rotate: hovered === theme.id ? 0 : tilt,
                    y: hovered === theme.id ? -6 : [0, -6, 0],
                  }
            }
            transition={
              reduced
                ? undefined
                : hovered === theme.id
                ? { duration: 0.25 }
                : {
                    y: {
                      duration: 4 + i * 0.6,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.4,
                    },
                  }
            }
            whileHover={{ scale: 1.05, zIndex: 10 }}
            onHoverStart={() => setHovered(theme.id)}
            onHoverEnd={() => setHovered(null)}
            style={{
              filter:
                hovered === theme.id
                  ? "drop-shadow(0 18px 28px rgba(74,50,111,0.35))"
                  : undefined,
            }}
          >
            <ThemeTile theme={theme} aspect="aspect-auto" className="h-full w-full" />
          </motion.div>
        );
      })}
    </div>
  );
}

/* ============================================================ */
/*  V3 — Hero preview + thumbnail strip (auto-cycle, click-pick) */
/* ============================================================ */

export function ThemesShowcaseV3() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (paused || reduced) return;
    const id = setInterval(() => {
      setActive((i) => (i + 1) % SHOWCASE_THEMES.length);
    }, 3000);
    return () => clearInterval(id);
  }, [paused, reduced]);

  const current = SHOWCASE_THEMES[active];

  return (
    <div
      className="mx-auto flex aspect-[4/3] w-full max-w-md gap-3"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <ThemeTile theme={current} aspect="aspect-auto" className="h-full w-full" />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex w-20 flex-col gap-2">
        {SHOWCASE_THEMES.map((theme, i) => (
          <button
            key={theme.id}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Show ${theme.name} theme`}
            aria-pressed={active === i}
            className={cn(
              "relative flex-1 overflow-hidden rounded-lg transition-all",
              active === i
                ? "ring-2 ring-secondary ring-offset-2"
                : "opacity-60 hover:opacity-100",
            )}
          >
            <ThemeTile theme={theme} aspect="aspect-auto" className="h-full w-full" />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ============================================================ */
/*  V4 — Scattered postcards → snap to grid on hover            */
/* ============================================================ */

export function ThemesShowcaseV4() {
  const [hovered, setHovered] = useState(false);
  const reduced = useReducedMotion();

  // Scattered positions (percentage-based so they scale with container)
  const SCATTER = [
    { x: -18, y: -10, rotate: -10 },
    { x: 18, y: -16, rotate: 8 },
    { x: -16, y: 14, rotate: 7 },
    { x: 20, y: 12, rotate: -6 },
  ];

  return (
    <div
      className="relative mx-auto aspect-[4/3] w-full max-w-md"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {SHOWCASE_THEMES.map((theme, i) => {
        const scatter = SCATTER[i] ?? { x: 0, y: 0, rotate: 0 };
        const grid = [
          { x: -28, y: -22 },
          { x: 28, y: -22 },
          { x: -28, y: 22 },
          { x: 28, y: 22 },
        ][i] ?? { x: 0, y: 0 };

        const target = reduced
          ? { x: `${scatter.x}%`, y: `${scatter.y}%`, rotate: scatter.rotate }
          : hovered
          ? { x: `${grid.x}%`, y: `${grid.y}%`, rotate: 0 }
          : { x: `${scatter.x}%`, y: `${scatter.y}%`, rotate: scatter.rotate };

        return (
          <motion.div
            key={theme.id}
            className="absolute left-1/2 top-1/2 w-[42%] -translate-x-1/2 -translate-y-1/2"
            initial={{
              x: `${scatter.x}%`,
              y: `${scatter.y}%`,
              rotate: scatter.rotate,
              opacity: 0,
            }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            animate={target}
            transition={{ type: "spring", stiffness: 200, damping: 24 }}
            whileHover={{ scale: 1.08, zIndex: 10 }}
          >
            <ThemeTile theme={theme} className="h-full w-full" />
          </motion.div>
        );
      })}
    </div>
  );
}

/* ============================================================ */
/*  V5 — Spring-stack to grid (entrance) + hover focus           */
/* ============================================================ */

export function ThemesShowcaseV5() {
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState<string | null>(null);

  const GRID = [
    { x: -52, y: -36 },
    { x: 52, y: -36 },
    { x: -52, y: 36 },
    { x: 52, y: 36 },
  ];

  return (
    <div className="relative mx-auto aspect-[4/3] w-full max-w-md">
      {SHOWCASE_THEMES.map((theme, i) => {
        const target = GRID[i];
        const isHovered = hovered === theme.id;
        const isOther = hovered !== null && !isHovered;

        return (
          <motion.div
            key={theme.id}
            className="absolute left-1/2 top-1/2 w-[40%] -translate-x-1/2 -translate-y-1/2"
            initial={{ x: 0, y: 0, scale: 0.6, opacity: 0 }}
            whileInView={
              reduced
                ? { x: `${target.x}%`, y: `${target.y}%`, scale: 1, opacity: 1 }
                : {
                    x: `${target.x}%`,
                    y: `${target.y}%`,
                    scale: 1,
                    opacity: 1,
                  }
            }
            viewport={{ once: true, amount: 0.3 }}
            animate={
              reduced
                ? undefined
                : {
                    scale: isHovered ? 1.12 : isOther ? 0.9 : 1,
                    opacity: isOther ? 0.55 : 1,
                  }
            }
            transition={{
              type: "spring",
              stiffness: 180,
              damping: 22,
              delay: i * 0.08,
            }}
            onHoverStart={() => setHovered(theme.id)}
            onHoverEnd={() => setHovered(null)}
            style={{ zIndex: isHovered ? 10 : 1 }}
          >
            <ThemeTile theme={theme} className="h-full w-full" />
          </motion.div>
        );
      })}
    </div>
  );
}
