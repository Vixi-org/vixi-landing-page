import Link from "next/link";

import { FadeUp } from "@/components/anim/fade-up";
import { HeadingPop } from "@/components/anim/heading-pop";
import { Cta } from "@/components/ui/cta";

export default function NotFound() {
  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col items-center px-4 py-24 text-center md:px-6 md:py-32">
      <FadeUp>
        <p className="font-subheading text-sm font-semibold uppercase tracking-widest text-secondary">
          404
        </p>
      </FadeUp>
      <HeadingPop
        as="h1"
        className="mt-4 text-4xl font-semibold leading-tight text-card-foreground md:text-5xl"
      >
        We couldn&apos;t find that page.
      </HeadingPop>
      <FadeUp delay={0.85}>
        <p className="mt-6 max-w-md text-base leading-7 text-foreground">
          The link may be broken, or the page may have moved. Head back home to
          keep exploring.
        </p>
        <Cta asChild size="lg" className="mt-8">
          <Link href="/">Back to home</Link>
        </Cta>
      </FadeUp>
    </section>
  );
}
