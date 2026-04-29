import Image from "next/image";

export function HowItWorksSection() {
  return (
    <section className="relative bg-gradient-to-b from-background to-muted/30 py-16 md:py-20">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <div className="overflow-hidden rounded-3xl border border-border/60 bg-background/80 p-3 shadow-[0_30px_80px_-40px_rgba(74,50,111,0.3)] backdrop-blur md:p-6">
          <Image
            src="/mockups/source-picker.png"
            alt="Vixi course builder: select a knowledge source like an e-book, LinkedIn post, presentation, or podcast and turn it into a gamified course"
            width={1600}
            height={900}
            className="h-auto w-full rounded-2xl"
            sizes="(min-width: 1024px) 1024px, 100vw"
          />
        </div>
      </div>
    </section>
  );
}
