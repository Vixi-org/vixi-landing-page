import type { ReactNode } from "react";

/**
 * Wrap a specific word inside a heading with the orange accent color.
 * The word is matched in English; for other locales it won't be found, so the
 * heading renders plain (no broken/mis-placed highlight) rather than coloring
 * the wrong word. HeadingPop recurses into the span, so the word still animates.
 */
export function hl(text: string, word: string): ReactNode {
  const i = text.indexOf(word);
  if (i === -1) return text;
  return (
    <>
      {text.slice(0, i)}
      <span className="text-secondary">{word}</span>
      {text.slice(i + word.length)}
    </>
  );
}
