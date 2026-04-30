"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";

const HEADING_LINES = [
  ["Transform", "your", "knowledge"],
  ["into", "gamified", "courses"],
];

const BODY =
  "Effortlessly turn traditional materials into dynamic, gamified courses that boost learner engagement. Our cutting-edge AI takes static content — whether an e-book, podcast, or lecture — and intelligently restructures it into a highly engaging, gamified course.";

const VARIANTS = ["v0", "v1", "v2", "v3", "v4", "v5"] as const;
type Variant = (typeof VARIANTS)[number];

export function TransformTextExperiment() {
  const searchParams = useSearchParams();
  const variant = (searchParams.get("anim") as Variant) ?? "v0";

  switch (variant) {
    case "v1":
      return <V1WordCascade key={variant} />;
    case "v2":
      return <V2BlurToClarity key={variant} />;
    case "v3":
      return <V3LetterPop key={variant} />;
    case "v4":
      return <V4HighlightSweep key={variant} />;
    case "v5":
      return <V5Tilt key={variant} />;
    default:
      return <V0Default key={variant} />;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// v0 — Default: single block fade + slide-up (baseline / current site)
// ─────────────────────────────────────────────────────────────────────────────

function V0Default() {
  const reduced = useReducedMotion();
  const initial = reduced ? false : { opacity: 0, y: 24 };
  const whileInView = { opacity: 1, y: 0 };

  return (
    <motion.div
      initial={initial}
      whileInView={whileInView}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
    >
      <Eyebrow />
      <DefaultHeading />
      <Body />
      <CTA />
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// v1 — Word cascade: each word fades + rises, slight stagger across lines
// ─────────────────────────────────────────────────────────────────────────────

function V1WordCascade() {
  const reduced = useReducedMotion();

  return (
    <div>
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
      >
        <Eyebrow />
      </motion.div>

      <h2 className="mt-4 text-3xl font-semibold leading-tight text-card-foreground md:text-5xl">
        {HEADING_LINES.map((line, lineIndex) => (
          <span key={lineIndex} className="block">
            {line.map((word, wordIndex) => {
              const delay =
                reduced ? 0 : 0.15 + lineIndex * 0.18 + wordIndex * 0.07;
              return (
                <span
                  key={wordIndex}
                  className="inline-block overflow-hidden align-bottom"
                >
                  <motion.span
                    className="inline-block"
                    initial={reduced ? false : { y: "100%", opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{
                      duration: 0.55,
                      delay,
                      ease: [0.22, 1, 0.36, 1] as const,
                    }}
                  >
                    {word}
                    {wordIndex < line.length - 1 ? " " : ""}
                  </motion.span>
                </span>
              );
            })}
          </span>
        ))}
      </h2>

      <motion.div
        initial={reduced ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, delay: reduced ? 0 : 0.7 }}
      >
        <Body />
        <CTA />
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// v2 — Blur to clarity: each block starts blurred, comes into focus
// ─────────────────────────────────────────────────────────────────────────────

function V2BlurToClarity() {
  const reduced = useReducedMotion();
  const make = (delay: number) => ({
    initial: reduced
      ? false
      : { opacity: 0, filter: "blur(14px)", y: 12 },
    whileInView: { opacity: 1, filter: "blur(0px)", y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <div>
      <motion.div {...make(0)}>
        <Eyebrow />
      </motion.div>
      <motion.div {...make(0.15)}>
        <DefaultHeading />
      </motion.div>
      <motion.div {...make(0.4)}>
        <Body />
      </motion.div>
      <motion.div {...make(0.6)}>
        <CTA />
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// v3 — Letter pop: characters of the heading scale-in with spring bounce
// ─────────────────────────────────────────────────────────────────────────────

function V3LetterPop() {
  const reduced = useReducedMotion();

  return (
    <div>
      <motion.div
        initial={reduced ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.4 }}
      >
        <Eyebrow />
      </motion.div>

      <h2 className="mt-4 text-3xl font-semibold leading-tight text-card-foreground md:text-5xl">
        {HEADING_LINES.map((line, lineIndex) => {
          const lineText = line.join(" ");
          const charsBefore = HEADING_LINES.slice(0, lineIndex).reduce(
            (sum, l) => sum + l.join(" ").length,
            0,
          );
          return (
            <span key={lineIndex} className="block">
              {lineText.split("").map((char, charIndex) => {
                const globalIndex = charsBefore + charIndex;
                const delay = reduced ? 0 : 0.2 + globalIndex * 0.025;
                return (
                  <motion.span
                    key={charIndex}
                    className="inline-block"
                    initial={reduced ? false : { opacity: 0, scale: 1.4, y: -8 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{
                      duration: 0.5,
                      delay,
                      type: "spring",
                      stiffness: 300,
                      damping: 16,
                    }}
                  >
                    {char === " " ? " " : char}
                  </motion.span>
                );
              })}
            </span>
          );
        })}
      </h2>

      <motion.div
        initial={reduced ? false : { opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, delay: reduced ? 0 : 0.95 }}
      >
        <Body />
        <CTA />
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// v4 — Highlight sweep: heading reveals via a left-to-right gradient mask
// ─────────────────────────────────────────────────────────────────────────────

function V4HighlightSweep() {
  const reduced = useReducedMotion();

  return (
    <div>
      <motion.div
        initial={reduced ? false : { opacity: 0, x: -16 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
      >
        <Eyebrow />
      </motion.div>

      <motion.h2
        className="mt-4 bg-gradient-to-r from-card-foreground to-card-foreground bg-clip-text text-3xl font-semibold leading-tight text-transparent md:text-5xl"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgb(74 50 111) 0%, rgb(74 50 111) 100%)",
          WebkitBackgroundClip: "text",
        }}
        initial={
          reduced
            ? false
            : { backgroundSize: "0% 100%", opacity: 0.2 }
        }
        whileInView={{ backgroundSize: "100% 100%", opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{
          duration: 1.2,
          delay: 0.2,
          ease: [0.22, 1, 0.36, 1] as const,
        }}
      >
        Transform your knowledge
        <br />
        into gamified courses
      </motion.h2>

      <motion.div
        initial={reduced ? false : { opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, delay: reduced ? 0 : 1.0 }}
      >
        <Body />
        <CTA />
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// v5 — Tilt entrance: text block flips forward into place with perspective
// ─────────────────────────────────────────────────────────────────────────────

function V5Tilt() {
  const reduced = useReducedMotion();

  return (
    <motion.div
      style={{ perspective: 1200, transformOrigin: "center top" }}
      initial={reduced ? false : { opacity: 0, rotateX: 28, y: 30 }}
      whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] as const }}
    >
      <Eyebrow />
      <DefaultHeading />
      <Body />
      <CTA />
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared markup
// ─────────────────────────────────────────────────────────────────────────────

function Eyebrow() {
  return (
    <span className="font-subheading text-sm font-semibold uppercase tracking-[0.2em] text-secondary">
      Learn More About Us
    </span>
  );
}

function DefaultHeading() {
  return (
    <h2 className="mt-4 text-3xl font-semibold leading-tight text-card-foreground md:text-5xl">
      Transform your knowledge
      <br />
      into gamified courses
    </h2>
  );
}

function Body() {
  return (
    <p className="mt-6 text-base leading-7 text-foreground md:text-lg">
      {BODY}
    </p>
  );
}

function CTA() {
  return (
    <Button
      asChild
      className="mt-8 h-11 rounded-full border-2 border-secondary bg-transparent px-6 text-sm font-semibold text-secondary hover:bg-secondary hover:text-secondary-foreground"
    >
      <Link href="/">Create your Duolingo-like course</Link>
    </Button>
  );
}
