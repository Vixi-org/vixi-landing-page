import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { FadeUp } from "@/components/anim/fade-up";
import { HeadingPop } from "@/components/anim/heading-pop";

const PARTNERS = [
  { src: "/partners/lau-innovation.png", alt: "LAU Fouad Makhzoumi Innovation Center" },
  { src: "/partners/microsoft-startups.png", alt: "Microsoft for Startups Founders Hub" },
  { src: "/partners/web-summit.png", alt: "Web Summit Qatar" },
  { src: "/partners/lau.png", alt: "Lebanese American University" },
];

export async function PartnersSection() {
  const t = await getTranslations("home.partners");
  return (
    <section className="bg-background pt-16 pb-9 md:pt-20 md:pb-10" aria-labelledby="partners-heading">
      <div className="mx-auto w-full max-w-6xl px-8 md:px-6">
        <HeadingPop
          as="h2"
          id="partners-heading"
          className="text-center text-2xl font-semibold text-card-foreground md:text-3xl"
        >
          {t("heading")}
        </HeadingPop>
        <ul className="mt-12 grid grid-cols-2 items-center justify-items-center gap-10 md:grid-cols-4 md:gap-14">
          {PARTNERS.map((partner, index) => (
            <FadeUp
              key={partner.alt}
              as="li"
              delay={0.08 * index}
              className="flex h-28 w-full items-center justify-center md:h-32"
            >
              <Image
                src={partner.src}
                alt={partner.alt}
                width={220}
                height={220}
                className="h-auto max-h-28 w-auto max-w-[260px] object-contain transition-transform duration-300 hover:scale-105 md:max-h-32 md:max-w-[280px]"
              />
            </FadeUp>
          ))}
        </ul>
      </div>
    </section>
  );
}
