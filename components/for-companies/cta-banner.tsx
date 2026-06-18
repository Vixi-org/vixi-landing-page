import { getTranslations } from "next-intl/server";

import { FadeUp } from "@/components/anim/fade-up";
import { HeadingPop } from "@/components/anim/heading-pop";
import { Cta } from "@/components/ui/cta";

interface CtaBannerProps {
  appUrl: string;
}

export async function CtaBanner({ appUrl }: CtaBannerProps) {
  const t = await getTranslations("ctaBanner");

  return (
    <section className="bg-background py-16 md:py-20">
      <div className="mx-auto w-full max-w-6xl px-8 md:px-6">
        <FadeUp className="relative overflow-hidden rounded-3xl border-2 border-secondary/40 bg-gradient-to-r from-[#fdf6f0] via-background to-[#fdf6f0] px-8 py-10 md:px-12 md:py-12">
          <div
            className="pointer-events-none absolute end-8 top-1/2 hidden h-24 w-32 -translate-y-1/2 opacity-40 md:block [background-image:radial-gradient(circle,rgb(74,50,111,0.6)_1.2px,transparent_1.2px)] [background-size:14px_14px]"
            aria-hidden
          />
          <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <HeadingPop className="text-2xl font-semibold leading-snug text-secondary md:text-3xl">
                {t("heading")}
              </HeadingPop>
              <FadeUp delay={1.05}>
                <p className="mt-3 text-sm leading-6 text-foreground md:text-base">
                  {t("body")}
                </p>
              </FadeUp>
            </div>
            <FadeUp delay={1.15}>
              <Cta asChild>
                <a href={`${appUrl}/signup`}>{t("cta")}</a>
              </Cta>
            </FadeUp>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
