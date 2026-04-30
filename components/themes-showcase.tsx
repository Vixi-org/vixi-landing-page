"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Theme {
  id: string;
  name: string;
  src: string;
  width: number;
  height: number;
}

const THEMES: Theme[] = [
  {
    id: "garden",
    name: "Garden",
    src: "/mockups/themes/garden.png",
    width: 744,
    height: 1180,
  },
  {
    id: "marketing",
    name: "Marketing foundation",
    src: "/mockups/themes/marketing.png",
    width: 740,
    height: 1186,
  },
  {
    id: "notebook",
    name: "Notebook",
    src: "/mockups/themes/notebook.png",
    width: 764,
    height: 1262,
  },
  {
    id: "treasure",
    name: "Geography foundation",
    src: "/mockups/themes/treasure.png",
    width: 758,
    height: 1334,
  },
];

const CYCLE_MS = 2400;

/**
 * Auto-rotating 3D card stack of the four real Vixi course themes.
 * Front card slides off and the next comes forward every 2.4s. Hover
 * pauses the cycle. Honors prefers-reduced-motion (renders the static
 * stack with no rotation).
 *
 * Used in the "Fully Customizable Course Themes" feature row on
 * /, /for-companies, and /for-schools.
 */
export function ThemesShowcase() {
  const [order, setOrder] = useState<Theme[]>(THEMES);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (paused || reduced) return;
    const id = window.setInterval(() => {
      setOrder((prev) => {
        const [first, ...rest] = prev;
        return [...rest, first];
      });
    }, CYCLE_MS);
    return () => window.clearInterval(id);
  }, [paused, reduced]);

  return (
    <div
      className="relative mx-auto flex w-full max-w-md items-center justify-center py-8"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="group"
      aria-label="Course theme previews"
    >
      <div
        className="relative aspect-[3/5] w-44 [perspective:1000px] md:w-56"
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
              <div className="relative h-full w-full overflow-hidden rounded-2xl bg-background shadow-[0_15px_40px_-20px_rgba(74,50,111,0.5)] ring-1 ring-border/40">
                <Image
                  src={theme.src}
                  alt={`${theme.name} course theme`}
                  width={theme.width}
                  height={theme.height}
                  sizes="(min-width: 768px) 224px, 176px"
                  className="h-full w-full object-cover"
                  priority={i === 0}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
