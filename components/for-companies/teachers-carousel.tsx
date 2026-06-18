import { getTranslations } from "next-intl/server";

import { FadeUp } from "@/components/anim/fade-up";
import { HeadingPop } from "@/components/anim/heading-pop";

const TEACHER_KEYS = ["history", "math", "biology", "physics"] as const;
const TEACHER_GRADIENTS = {
  history: { from: "from-amber-200", to: "to-orange-300" },
  math: { from: "from-purple-200", to: "to-fuchsia-300" },
  biology: { from: "from-emerald-200", to: "to-teal-300" },
  physics: { from: "from-sky-200", to: "to-indigo-300" },
};

export async function TeachersCarousel() {
  const t = await getTranslations("teachersCarousel");

  return (
    <section className="bg-gradient-to-b from-background via-[#fdf6f0] to-background py-20 md:py-28" aria-labelledby="teachers-heading">
      <div className="mx-auto w-full max-w-6xl px-8 md:px-6">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <FadeUp>
              <span className="font-subheading text-sm font-semibold uppercase tracking-[0.2em] text-secondary">
                {t("eyebrow")}
              </span>
            </FadeUp>
            <HeadingPop
              id="teachers-heading"
              className="mt-4 text-3xl font-semibold leading-tight text-card-foreground md:text-5xl"
            >
              {t("headingLine1")}
              <br />
              {t("headingLine2")}
              <br />
              {t("headingLine3")}{" "}
              <span className="text-secondary">
                {t("headingLine3Highlight")}
              </span>
            </HeadingPop>
            <FadeUp delay={0.95}>
              <p className="mt-6 max-w-md text-base leading-7 text-foreground md:text-lg">
                {t("body")}
              </p>
              <div
                className="mt-8 h-16 w-32 opacity-40 [background-image:radial-gradient(circle,rgb(74,50,111,0.7)_1.5px,transparent_1.5px)] [background-size:14px_14px]"
                aria-hidden
              />
            </FadeUp>
          </div>

          <ul
            className="-me-4 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pe-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:-me-6 md:pe-6"
            role="list"
          >
            {TEACHER_KEYS.map((key, index) => {
              const grad = TEACHER_GRADIENTS[key];
              return (
                <FadeUp
                  key={key}
                  as="li"
                  delay={0.1 * index}
                  className="relative aspect-[3/4] w-[220px] shrink-0 snap-start overflow-hidden rounded-3xl bg-gradient-to-br shadow-[0_20px_50px_-25px_rgba(74,50,111,0.4)] transition-transform duration-300 hover:-translate-y-1 md:w-[260px]"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${grad.from} ${grad.to}`}
                    aria-hidden
                  />
                  <div className="absolute inset-x-0 top-0 flex h-3/4 items-end justify-center">
                    <div className="relative h-[85%] w-[60%]">
                      <div className="absolute left-1/2 top-0 h-[40%] w-[60%] -translate-x-1/2 rounded-full bg-card-foreground/40" />
                      <div className="absolute bottom-0 left-1/2 h-[60%] w-[90%] -translate-x-1/2 rounded-t-[40%] bg-card-foreground/35" />
                    </div>
                  </div>
                  <div className="absolute inset-x-3 bottom-3 rounded-2xl bg-gradient-to-t from-card-foreground/85 to-card-foreground/60 px-4 py-3 backdrop-blur">
                    <p className="text-base font-semibold text-white">
                      {t(`teachers.${key}.role`)}
                    </p>
                    <p className="text-xs text-white/80">
                      {t(`teachers.${key}.name`)}
                    </p>
                  </div>
                </FadeUp>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
