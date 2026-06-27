"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Children,
  Fragment,
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";

// Cursive scripts (Arabic, Persian, Urdu, …) must keep each word's letters in a
// single text run, or they lose their connecting (initial / medial / final)
// forms and render disjointed. When a word contains such characters we animate
// the whole word as one unit instead of splitting it into per-character spans.
const CURSIVE_RE =
  /[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿]/;

interface HeadingPopProps {
  children: ReactNode;
  className?: string;
  /** Render as h1, h2, h3, h4. Default h2. */
  as?: "h1" | "h2" | "h3" | "h4";
  /** Delay before first character animates, in seconds. Default 0.19. */
  startDelay?: number;
  /** Delay between consecutive characters, in seconds. Default 0.0275. */
  charStagger?: number;
  /** Forwarded to the underlying heading tag. */
  id?: string;
}

/**
 * Letter-by-letter pop entrance for headings — the v3 winner from the
 * animation A/B test. Each visible character scales / fades / rises into
 * place with a soft spring, in reading order.
 *
 * Handles arbitrary heading JSX:
 *   - plain strings → split per character
 *   - `<br/>`, `<svg>`, `<img>` → passed through untouched
 *   - nested elements (e.g. `<span class="text-secondary">` for colour
 *     highlights) → recurse so the inner text animates while the
 *     parent's coloring / styling is preserved
 *
 * Honours `prefers-reduced-motion`.
 *
 * For animating a heading + its body+CTA together while preserving the
 * v3 timing, wrap the body+CTA in a separate `<FadeUp delay={…}>` set to
 * roughly `startDelay + heading.length * charStagger`.
 */
export function HeadingPop({
  children,
  className,
  as: Tag = "h2",
  startDelay = 0.19,
  charStagger = 0.0275,
  id,
}: HeadingPopProps) {
  const reduced = useReducedMotion();

  // Mutable counter shared across the recursive walk so every visible
  // character gets a strictly-increasing delay regardless of nesting.
  let charIndex = 0;

  const animateChar = (char: string, key: string): ReactElement => {
    const delay = reduced ? 0 : startDelay + charIndex * charStagger;
    charIndex += 1;
    return (
      <motion.span
        key={key}
        className="inline-block vixi-reveal"
        initial={reduced ? false : { opacity: 0, scale: 1.4, y: -8 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{
          duration: 0.5625,
          delay,
          type: "spring",
          stiffness: 240,
          damping: 14,
        }}
      >
        {char}
      </motion.span>
    );
  };

  // Split by space → each word becomes a `whitespace-nowrap` wrapper
  // containing per-character motion.spans. The wrapper prevents the
  // browser from breaking *within* a word (adjacent inline-blocks are
  // otherwise valid break points), while the literal text-node spaces
  // between words remain the only line-wrap opportunities.
  const splitString = (text: string, prefix: string): ReactNode => {
    const out: ReactNode[] = [];
    const words = text.split(" ");
    words.forEach((word, wordIdx) => {
      if (wordIdx > 0) out.push(" ");
      if (word.length === 0) return;
      // Cursive words must stay whole, or their letters disconnect — animate
      // the entire word as a single unit instead of per character.
      if (CURSIVE_RE.test(word)) {
        out.push(animateChar(word, `${prefix}-w-${wordIdx}`));
        return;
      }
      const chars: ReactNode[] = [];
      word.split("").forEach((c, i) => {
        chars.push(animateChar(c, `${prefix}-${wordIdx}-${i}`));
      });
      out.push(
        // dir="ltr" keeps Latin words (e.g. a brand name inside an Arabic
        // heading) from rendering right-to-left when the page is RTL.
        <span
          key={`${prefix}-w-${wordIdx}`}
          dir="ltr"
          style={{ whiteSpace: "nowrap" }}
        >
          {chars}
        </span>,
      );
    });
    return out;
  };

  const walk = (node: ReactNode, path: string): ReactNode => {
    if (node === null || node === undefined || typeof node === "boolean") {
      return node;
    }
    if (typeof node === "string") {
      return splitString(node, path);
    }
    if (typeof node === "number") {
      return splitString(String(node), path);
    }
    if (Array.isArray(node)) {
      return node.map((child, i) => (
        <Fragment key={`${path}-${i}`}>{walk(child, `${path}-${i}`)}</Fragment>
      ));
    }
    if (isValidElement<{ children?: ReactNode }>(node)) {
      const { children: nodeChildren } = node.props;
      // Self-closing / empty elements (br, etc.) pass through.
      if (nodeChildren === undefined || nodeChildren === null) {
        return node;
      }
      // Non-text elements we shouldn't tokenise (svg, img, etc.) pass through.
      if (typeof node.type === "string" && SKIP_RECURSE.has(node.type)) {
        return node;
      }
      return cloneElement(node, undefined, walk(nodeChildren, `${path}-c`));
    }
    return node;
  };

  return (
    <Tag className={className} id={id}>
      {Children.map(children, (child, i) => (
        <Fragment key={i}>{walk(child, String(i))}</Fragment>
      ))}
    </Tag>
  );
}

const SKIP_RECURSE = new Set(["svg", "img", "video", "iframe", "canvas"]);
