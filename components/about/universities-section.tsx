import Image from "next/image";
import { Check } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { FadeUp } from "@/components/anim/fade-up";
import { HeadingPop } from "@/components/anim/heading-pop";
import { Link } from "@/i18n/navigation";
import { Cta } from "@/components/ui/cta";

export async function UniversitiesSection() {
  const t = await getTranslations("about.universities");
  const tCommon = await getTranslations("common");
  const bullets = t.raw("bullets") as string[];

  return (
    <section className="bg-background py-20 md:py-28">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <HeadingPop className="text-3xl font-semibold leading-tight text-card-foreground md:text-5xl">
              {t("headingLine1")}
              <br />
              {t("headingLine2")}
              <br />
              <span className="text-primary">{t("headingLine3Highlight")}</span>
            </HeadingPop>
            <FadeUp delay={1.1}>
              <p className="mt-6 text-base leading-7 text-foreground md:text-lg">
                {t("intro")}
              </p>
              <ul className="mt-6 space-y-3">
                {bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-secondary text-secondary">
                      <Check className="size-3" strokeWidth={3} aria-hidden />
                    </span>
                    <span className="text-base leading-6 text-card-foreground">
                      {bullet}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm leading-6 text-foreground">
                {t("outro")}
              </p>
              <Cta asChild className="mt-8">
                <Link href="/contact">{tCommon("scheduleDemo")}</Link>
              </Cta>
            </FadeUp>
          </div>

          <FadeUp delay={0.15} className="relative">
            <span
              className="absolute -top-4 start-2 hidden h-6 w-12 rounded-full border border-primary/40 bg-background shadow-sm md:block"
              aria-hidden
            >
              <span className="block h-full w-5 translate-x-1 rounded-full bg-primary/70" />
            </span>
            <span
              className="absolute -top-1 start-12 hidden h-5 w-10 rounded-full border border-primary/40 bg-background shadow-sm md:block"
              aria-hidden
            >
              <span className="ms-auto block h-full w-4 rounded-full bg-primary/70" />
            </span>

            <svg
              aria-hidden
              className="absolute -end-4 -top-2 hidden h-[110%] w-1/2 text-primary/45 md:block"
              viewBox="0 0 200 400"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                d="M 60 30 C 220 60, 220 280, 30 380"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="5 7"
                strokeLinecap="round"
              />
            </svg>

            <Image
              src="/mockups/universities.png"
              alt={t("imageAlt")}
              width={1000}
              height={1100}
              className="relative h-auto w-full"
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
