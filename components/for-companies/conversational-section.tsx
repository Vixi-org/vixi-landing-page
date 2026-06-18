import { getTranslations } from "next-intl/server";

import { FadeUp } from "@/components/anim/fade-up";
import { HeadingPop } from "@/components/anim/heading-pop";
import { CourseConversation } from "@/components/for-companies/course-conversation";
import { Cta } from "@/components/ui/cta";
import { DEMO_URL } from "@/lib/urls";

export async function ConversationalSection() {
  const t = await getTranslations("conversationalSection");
  const tCommon = await getTranslations("common");

  return (
    <section className="bg-background py-20 md:py-28">
      <div className="mx-auto w-full max-w-6xl px-8 md:px-6">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <HeadingPop className="text-3xl font-semibold leading-tight md:text-5xl">
              <span className="text-secondary">{t("headingLine1Highlight")}</span>
              <br />
              <span className="text-card-foreground">{t("headingLine2")}</span>
            </HeadingPop>
            <FadeUp delay={0.75}>
              <p className="mt-6 text-base leading-7 text-foreground md:text-lg">
                {t("body")}
              </p>
              <Cta asChild className="mt-8">
                <a href={DEMO_URL}>{tCommon("seeADemo")}</a>
              </Cta>
            </FadeUp>
          </div>

          <FadeUp delay={0.15} className="relative">
            <CourseConversation />
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
