import {
  V1DuolingoStack,
  V2SoftCushion,
  V3BevelGradient,
  V4HardOffset,
} from "@/components/anim/experiments/button-variants";

const VARIANTS = [
  {
    id: "v1",
    label: "V1 · Duolingo Stack",
    blurb:
      "Solid pill with a darker bottom layer. Press drops it onto the layer.",
    Component: V1DuolingoStack,
  },
  {
    id: "v2",
    label: "V2 · Soft Cushion",
    blurb: "Inner highlight, ambient orange glow, scales up on hover. Gummy.",
    Component: V2SoftCushion,
  },
  {
    id: "v3",
    label: "V3 · Bevel Gradient",
    blurb: "Top-down gradient with inset bevel + glow. Inverts on press.",
    Component: V3BevelGradient,
  },
  {
    id: "v4",
    label: "V4 · Hard Offset",
    blurb: "Notion-style solid offset shadow. Slides on hover.",
    Component: V4HardOffset,
  },
];

/**
 * Throwaway A/B-test section. Renders all 4 button variants side by
 * side with labels so the user can compare directly. Removed once a
 * winner is picked and the chosen pattern graduates to the production
 * Button component.
 */
export function ButtonGallery() {
  return (
    <section className="relative bg-gradient-to-b from-muted/40 via-background to-muted/40 py-20 md:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <div className="mb-10 text-center">
          <p className="font-subheading text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
            Button experiment · pick one
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-card-foreground md:text-3xl">
            Hover and click each — tell me which feel wins.
          </h2>
        </div>
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VARIANTS.map(({ id, label, blurb, Component }) => (
            <li
              key={id}
              className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-background/80 p-7 shadow-[0_15px_40px_-30px_rgba(74,50,111,0.4)]"
            >
              <p className="font-mono text-xs font-semibold uppercase tracking-wider text-card-foreground">
                {label}
              </p>
              <div className="flex min-h-[80px] items-center justify-center">
                <Component href="#">Create your course</Component>
              </div>
              <p className="text-center text-xs leading-relaxed text-foreground">
                {blurb}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
