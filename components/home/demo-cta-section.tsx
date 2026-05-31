import { getTranslations } from "next-intl/server";

import { FadeUp } from "@/components/anim/fade-up";
import { HeadingPop } from "@/components/anim/heading-pop";
import { Cta } from "@/components/ui/cta";
import { DEMO_URL } from "@/lib/urls";

export async function DemoCtaSection() {
  const t = await getTranslations("demoCta");
  const tCommon = await getTranslations("common");

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#fdf6f0] via-background to-[#fdf6f0] py-20 md:py-24">
      <div
        className="pointer-events-none absolute end-12 top-1/2 hidden h-32 w-40 -translate-y-1/2 opacity-60 md:block [background-image:radial-gradient(circle,rgb(74,50,111,0.6)_1.5px,transparent_1.5px)] [background-size:18px_18px]"
        aria-hidden
      />
      <div className="relative mx-auto w-full max-w-6xl px-4 md:px-6">
        <div className="max-w-xl">
          <FadeUp>
            <span className="font-subheading text-sm font-semibold uppercase tracking-[0.2em] text-secondary">
              {t("eyebrow")}
            </span>
          </FadeUp>
          <HeadingPop className="mt-4 text-3xl font-semibold leading-tight text-card-foreground md:text-5xl">
            {t("heading")}
          </HeadingPop>
          <FadeUp delay={0.65}>
            <p className="mt-5 text-base leading-7 text-foreground md:text-lg">
              {t("body")}
            </p>
            <Cta asChild className="mt-8">
              <a href={DEMO_URL}>{tCommon("seeADemo")}</a>
            </Cta>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
