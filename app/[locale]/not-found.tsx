import { getTranslations } from "next-intl/server";

import { FadeUp } from "@/components/anim/fade-up";
import { HeadingPop } from "@/components/anim/heading-pop";
import { Link } from "@/i18n/navigation";
import { Cta } from "@/components/ui/cta";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col items-center px-4 py-24 text-center md:px-6 md:py-32">
      <FadeUp>
        <p className="font-subheading text-sm font-semibold uppercase tracking-widest text-secondary">
          {t("code")}
        </p>
      </FadeUp>
      <HeadingPop
        as="h1"
        className="mt-4 text-4xl font-semibold leading-tight text-card-foreground md:text-5xl"
      >
        {t("heading")}
      </HeadingPop>
      <FadeUp delay={0.85}>
        <p className="mt-6 max-w-md text-base leading-7 text-foreground">
          {t("body")}
        </p>
        <Cta asChild size="lg" className="mt-8">
          <Link href="/">{t("cta")}</Link>
        </Cta>
      </FadeUp>
    </section>
  );
}
