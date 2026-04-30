import Link from "next/link";

import { FadeUp } from "@/components/anim/fade-up";
import { HeadingPop } from "@/components/anim/heading-pop";
import { CourseConversation } from "@/components/for-companies/course-conversation";
import { Cta } from "@/components/ui/cta";

export function ConversationalSection() {
  return (
    <section className="bg-background py-20 md:py-28">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <HeadingPop className="text-3xl font-semibold leading-tight md:text-5xl">
              <span className="text-secondary">Conversational</span>
              <br />
              <span className="text-card-foreground">Learning Format</span>
            </HeadingPop>
            <FadeUp delay={0.75}>
              <p className="mt-6 text-base leading-7 text-foreground md:text-lg">
                Traditional text-heavy content is converted into interactive
                dialogues and role-play scenarios, keeping students engaged while
                learning core concepts.
              </p>
              <Cta asChild className="mt-8">
                <Link href="/contact">See a demo</Link>
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
