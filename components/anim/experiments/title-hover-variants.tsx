"use client";

import {
  motion,
  useMotionValue,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef, useState, type ReactNode } from "react";

const HEADING_LINES = ["Turn yourself into an", "animated character"];

const PURPLE = "rgb(74, 50, 111)";
const ORANGE = "rgb(255, 164, 44)";

// ─────────────────────────────────────────────────────────────────────
// Shared layout: wraps two centred lines into a heading.
// ─────────────────────────────────────────────────────────────────────

function HeadingShell({
  children,
  onMouseMove,
  onMouseLeave,
}: {
  children: (lineIndex: number, line: string, charBase: number) => ReactNode;
  onMouseMove?: (e: React.MouseEvent<HTMLHeadingElement>) => void;
  onMouseLeave?: () => void;
}) {
  let charBase = 0;
  return (
    <h2
      className="text-3xl font-semibold leading-tight text-card-foreground md:text-5xl"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {HEADING_LINES.map((line, lineIndex) => {
        const node = children(lineIndex, line, charBase);
        charBase += line.length;
        return (
          <span key={lineIndex} className="block">
            {node}
          </span>
        );
      })}
    </h2>
  );
}

function splitChars(line: string) {
  return line.split("");
}

// ─────────────────────────────────────────────────────────────────────
// V1 — Color trail
// Hovered char snaps to orange instantly; on leave, colour fades back
// over 0.6s. Sweep the cursor across the heading and you draw a
// dissolving orange trail.
// ─────────────────────────────────────────────────────────────────────

export function V1ColorTrail() {
  return (
    <HeadingShell>
      {(_lineIndex, line) =>
        splitChars(line).map((char, i) => (
          <CharColorTrail key={i} char={char} />
        ))
      }
    </HeadingShell>
  );
}

function CharColorTrail({ char }: { char: string }) {
  const [hovered, setHovered] = useState(false);
  if (char === " ") return <span> </span>;
  return (
    <motion.span
      className="inline-block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      animate={{ color: hovered ? ORANGE : PURPLE }}
      transition={{ duration: hovered ? 0.05 : 0.6 }}
    >
      {char}
    </motion.span>
  );
}

// ─────────────────────────────────────────────────────────────────────
// V2 — Lift & bump
// Each hovered char springs up ~10px and scales 1.15× with bouncy
// physics. Returns to baseline when the cursor moves off.
// ─────────────────────────────────────────────────────────────────────

export function V2LiftBump() {
  return (
    <HeadingShell>
      {(_lineIndex, line) =>
        splitChars(line).map((char, i) => (
          <CharLift key={i} char={char} />
        ))
      }
    </HeadingShell>
  );
}

function CharLift({ char }: { char: string }) {
  const [hovered, setHovered] = useState(false);
  if (char === " ") return <span> </span>;
  return (
    <motion.span
      className="inline-block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      animate={{
        y: hovered ? -10 : 0,
        scale: hovered ? 1.15 : 1,
        color: hovered ? ORANGE : PURPLE,
      }}
      transition={{ type: "spring", stiffness: 320, damping: 12 }}
    >
      {char}
    </motion.span>
  );
}

// ─────────────────────────────────────────────────────────────────────
// V3 — Magnetic pull
// Characters within a radius of the cursor translate slightly toward
// it; strength inversely proportional to distance. Cursor drags the
// nearest letters with it.
// ─────────────────────────────────────────────────────────────────────

const PULL_RADIUS = 110;
const PULL_STRENGTH = 0.35;

export function V3Magnetic() {
  const mouseX = useMotionValue<number | null>(null);
  const mouseY = useMotionValue<number | null>(null);

  return (
    <HeadingShell
      onMouseMove={(e) => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
      }}
      onMouseLeave={() => {
        mouseX.set(null);
        mouseY.set(null);
      }}
    >
      {(_lineIndex, line) =>
        splitChars(line).map((char, i) => (
          <CharMagnetic key={i} char={char} mouseX={mouseX} mouseY={mouseY} />
        ))
      }
    </HeadingShell>
  );
}

function CharMagnetic({
  char,
  mouseX,
  mouseY,
}: {
  char: string;
  mouseX: MotionValue<number | null>;
  mouseY: MotionValue<number | null>;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  const offset = (axis: "x" | "y") => () => {
    const el = ref.current;
    const mx = mouseX.get();
    const my = mouseY.get();
    if (!el || mx === null || my === null) return 0;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = mx - cx;
    const dy = my - cy;
    const dist = Math.hypot(dx, dy);
    if (dist > PULL_RADIUS) return 0;
    const pull = (1 - dist / PULL_RADIUS) * PULL_STRENGTH;
    return (axis === "x" ? dx : dy) * pull;
  };

  const x = useTransform(offset("x"));
  const y = useTransform(offset("y"));

  if (char === " ") return <span> </span>;
  return (
    <motion.span
      ref={ref}
      className="inline-block"
      style={{ x, y }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
    >
      {char}
    </motion.span>
  );
}

// ─────────────────────────────────────────────────────────────────────
// V4 — Wave ripple
// Cursor X drives a horizontal sine wave: nearest char lifts highest,
// neighbours decay smoothly. Sweep across the heading and the text
// surfs the cursor.
// ─────────────────────────────────────────────────────────────────────

const WAVE_FALLOFF = 90;
const WAVE_AMPLITUDE = 18;

export function V4Wave() {
  const mouseX = useMotionValue<number | null>(null);

  return (
    <HeadingShell
      onMouseMove={(e) => mouseX.set(e.clientX)}
      onMouseLeave={() => mouseX.set(null)}
    >
      {(_lineIndex, line) =>
        splitChars(line).map((char, i) => (
          <CharWave key={i} char={char} mouseX={mouseX} />
        ))
      }
    </HeadingShell>
  );
}

function CharWave({
  char,
  mouseX,
}: {
  char: string;
  mouseX: MotionValue<number | null>;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  const y = useTransform(mouseX, (mx) => {
    const el = ref.current;
    if (!el || mx === null) return 0;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const dist = Math.abs((mx as number) - cx);
    if (dist > WAVE_FALLOFF) return 0;
    // Cosine bell — smooth peak directly under cursor, decays to 0 at falloff
    const wave = Math.cos(((dist / WAVE_FALLOFF) * Math.PI) / 2);
    return -wave * WAVE_AMPLITUDE;
  });

  const scale = useTransform(mouseX, (mx) => {
    const el = ref.current;
    if (!el || mx === null) return 1;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const dist = Math.abs((mx as number) - cx);
    if (dist > WAVE_FALLOFF) return 1;
    const wave = Math.cos(((dist / WAVE_FALLOFF) * Math.PI) / 2);
    return 1 + wave * 0.18;
  });

  if (char === " ") return <span> </span>;
  return (
    <motion.span
      ref={ref}
      className="inline-block"
      style={{ y, scale }}
      transition={{ type: "spring", stiffness: 220, damping: 14 }}
    >
      {char}
    </motion.span>
  );
}

// ─────────────────────────────────────────────────────────────────────
// V5 — Spotlight glow
// Hovered char (and immediate neighbours via radius) scales up and
// gains a soft orange text-shadow halo. Cursor acts like a spotlight
// passing across the title.
// ─────────────────────────────────────────────────────────────────────

const GLOW_RADIUS = 70;

export function V5Spotlight() {
  const mouseX = useMotionValue<number | null>(null);

  return (
    <HeadingShell
      onMouseMove={(e) => mouseX.set(e.clientX)}
      onMouseLeave={() => mouseX.set(null)}
    >
      {(_lineIndex, line) =>
        splitChars(line).map((char, i) => (
          <CharSpotlight key={i} char={char} mouseX={mouseX} />
        ))
      }
    </HeadingShell>
  );
}

function CharSpotlight({
  char,
  mouseX,
}: {
  char: string;
  mouseX: MotionValue<number | null>;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  const intensity = useTransform(mouseX, (mx) => {
    const el = ref.current;
    if (!el || mx === null) return 0;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const dist = Math.abs((mx as number) - cx);
    if (dist > GLOW_RADIUS) return 0;
    return Math.cos(((dist / GLOW_RADIUS) * Math.PI) / 2);
  });

  const scale = useTransform(intensity, (i) => 1 + i * 0.22);
  const textShadow = useTransform(
    intensity,
    (i) =>
      `0 0 ${i * 18}px rgba(255, 164, 44, ${i * 0.85}), 0 0 ${i * 36}px rgba(255, 164, 44, ${i * 0.4})`,
  );
  const color = useTransform(intensity, (i) =>
    i > 0.3 ? ORANGE : PURPLE,
  );

  if (char === " ") return <span> </span>;
  return (
    <motion.span
      ref={ref}
      className="inline-block"
      style={{ scale, textShadow, color }}
      transition={{ type: "spring", stiffness: 240, damping: 16 }}
    >
      {char}
    </motion.span>
  );
}

// ─────────────────────────────────────────────────────────────────────
// V0 — Static (baseline / no hover effect, for comparison)
// ─────────────────────────────────────────────────────────────────────

export function V0Static() {
  return (
    <HeadingShell>
      {(_lineIndex, line) => <span>{line}</span>}
    </HeadingShell>
  );
}
