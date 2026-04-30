import Link from "next/link";

import { FadeUp } from "@/components/anim/fade-up";
import { HeadingPop } from "@/components/anim/heading-pop";
import { Button } from "@/components/ui/button";

const PHONES = [
  {
    rotation: "rotate-[-6deg]",
    bubbles: [
      "Sounds like a fancy jewelry line, but sure, what's it about?",
      "Let's explore the concept of the 'Golden Circle' that is…",
    ],
  },
  {
    rotation: "rotate-[3deg]",
    bubbles: [
      "Did you know a good leader…",
      "Really? Why would I do that?",
    ],
  },
  {
    rotation: "rotate-[-2deg]",
    bubbles: [
      "Have you ever experienced this?",
      "Oh yeah! 'Sale ends midnight!' gets me every time.",
    ],
  },
];

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
              <Button
                asChild
                className="mt-8 h-11 rounded-full bg-secondary px-6 text-sm font-semibold text-secondary-foreground hover:bg-secondary/90"
              >
                <Link href="/contact">See a demo</Link>
              </Button>
            </FadeUp>
          </div>

          <FadeUp delay={0.15} className="relative grid grid-cols-2 gap-4">
            {PHONES.map((phone, i) => (
              <div
                key={i}
                className={`${phone.rotation} ${
                  i === 2 ? "col-span-2 mx-auto w-1/2" : ""
                } relative aspect-[9/19] rounded-[1.8rem] bg-card-foreground p-1.5 shadow-2xl ring-1 ring-white/10`}
              >
                <div className="relative flex h-full flex-col gap-2 overflow-hidden rounded-[1.4rem] bg-gradient-to-br from-[#fdf6f0] to-muted p-3">
                  <span className="absolute left-1/2 top-1.5 h-1 w-8 -translate-x-1/2 rounded-full bg-card-foreground/50" />
                  <div className="mt-3 flex items-center gap-2">
                    <span className="h-6 w-6 rounded-full bg-secondary" />
                    <span className="h-1 flex-1 rounded-full bg-muted-foreground/30" />
                  </div>
                  <div className="mt-2 flex flex-col gap-2">
                    {phone.bubbles.map((b, j) => (
                      <div
                        key={j}
                        className={`max-w-[85%] rounded-2xl px-2.5 py-1.5 text-[8px] leading-tight ${
                          j === 0
                            ? "self-start bg-background text-card-foreground"
                            : "self-end bg-secondary/20 text-card-foreground"
                        }`}
                      >
                        {b}
                      </div>
                    ))}
                  </div>
                  <div className="mt-auto rounded-xl bg-primary/90 px-2 py-1.5 text-center text-[8px] font-semibold text-primary-foreground">
                    Continue
                  </div>
                </div>
              </div>
            ))}
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
