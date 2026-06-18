import { getTranslations } from "next-intl/server";

import { FadeUp } from "@/components/anim/fade-up";
import { HeadingPop } from "@/components/anim/heading-pop";
import { Cta } from "@/components/ui/cta";

const CONTACT_EMAIL = "hassan@vixiai.co";
const LINKEDIN_URL = "https://www.linkedin.com/company/vixi-ai";
const LINKEDIN_PATH =
  "M20.451 20.452h-3.554v-5.569c0-1.328-.024-3.037-1.852-3.037-1.853 0-2.136 1.447-2.136 2.94v5.666H9.355V9h3.414v1.561h.046c.477-.9 1.637-1.852 3.37-1.852 3.602 0 4.267 2.37 4.267 5.455v6.288zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.226.792 24 1.771 24h20.451C23.2 24 24 23.226 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z";

export async function ContactSection() {
  const t = await getTranslations("contact.section");

  return (
    <section className="bg-background pt-28 pb-20 md:pt-32 md:pb-24">
      <div className="mx-auto w-full max-w-6xl px-8 md:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr] md:gap-16">
          <div>
            <FadeUp>
              <span className="font-subheading text-sm font-semibold uppercase tracking-[0.2em] text-secondary">
                {t("eyebrow")}
              </span>
            </FadeUp>
            <HeadingPop className="mt-4 text-3xl font-semibold leading-tight text-card-foreground md:text-5xl">
              {t("heading")}
            </HeadingPop>
            <FadeUp delay={0.7}>
              <dl className="mt-8 space-y-3 text-base text-card-foreground">
                <div className="flex flex-wrap items-baseline gap-2">
                  <dt className="font-medium text-foreground">
                    {t("emailLabel")}
                  </dt>
                  <dd>
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="text-card-foreground transition-colors hover:text-secondary"
                      dir="ltr"
                    >
                      {CONTACT_EMAIL}
                    </a>
                  </dd>
                </div>
                <div className="flex flex-wrap items-baseline gap-2">
                  <dt className="font-medium text-foreground">
                    {t("locationLabel")}
                  </dt>
                  <dd>{t("location")}</dd>
                </div>
              </dl>
              <Cta asChild className="mt-8">
                <a
                  href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
                    t("emailSubject"),
                  )}`}
                >
                  {t("cta")}
                </a>
              </Cta>
            </FadeUp>
          </div>

          <FadeUp delay={0.1} className="flex items-start md:justify-end">
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 w-12 items-center justify-center rounded-md bg-[#0a66c2] text-white shadow-md transition-transform hover:scale-105"
              aria-label={t("linkedinAriaLabel")}
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6"
                aria-hidden
              >
                <path d={LINKEDIN_PATH} />
              </svg>
            </a>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
