import { FadeUp } from "@/components/anim/fade-up";
import { HeadingPop } from "@/components/anim/heading-pop";

const TEACHERS = [
  { role: "History teacher", name: "Alex Huffman", from: "from-amber-200", to: "to-orange-300" },
  { role: "Math teacher", name: "Hugo Hoffman", from: "from-purple-200", to: "to-fuchsia-300" },
  { role: "Biology teacher", name: "Henry Lucas", from: "from-emerald-200", to: "to-teal-300" },
  { role: "Physics teacher", name: "Lina Carter", from: "from-sky-200", to: "to-indigo-300" },
];

export function TeachersCarousel() {
  return (
    <section className="bg-gradient-to-b from-background via-[#fdf6f0] to-background py-20 md:py-28" aria-labelledby="teachers-heading">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <FadeUp>
              <span className="font-subheading text-sm font-semibold uppercase tracking-[0.2em] text-secondary">
                Developers
              </span>
            </FadeUp>
            <HeadingPop
              id="teachers-heading"
              className="mt-4 text-3xl font-semibold leading-tight text-card-foreground md:text-5xl"
            >
              Engaging 3D
              <br />
              Animated Avatars
              <br />
              of <span className="text-secondary">Teachers</span>
            </HeadingPop>
            <FadeUp delay={0.95}>
              <p className="mt-6 max-w-md text-base leading-7 text-foreground md:text-lg">
                Teachers can upload their photo, and our AI generates a 3D
                animated version of them to personally guide students through
                lessons — making remote learning more engaging and familiar.
              </p>
              {/* dot decoration */}
              <div
                className="mt-8 h-16 w-32 opacity-40 [background-image:radial-gradient(circle,rgb(74,50,111,0.7)_1.5px,transparent_1.5px)] [background-size:14px_14px]"
                aria-hidden
              />
            </FadeUp>
          </div>

          <ul
            className="-mr-4 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pr-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:-mr-6 md:pr-6"
            role="list"
          >
            {TEACHERS.map((t, index) => (
              <FadeUp
                key={t.role}
                as="li"
                delay={0.1 * index}
                className="relative aspect-[3/4] w-[220px] shrink-0 snap-start overflow-hidden rounded-3xl bg-gradient-to-br shadow-[0_20px_50px_-25px_rgba(74,50,111,0.4)] transition-transform duration-300 hover:-translate-y-1 md:w-[260px]"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${t.from} ${t.to}`} aria-hidden />
                {/* simplified avatar silhouette */}
                <div className="absolute inset-x-0 top-0 flex h-3/4 items-end justify-center">
                  <div className="relative h-[85%] w-[60%]">
                    <div className="absolute left-1/2 top-0 h-[40%] w-[60%] -translate-x-1/2 rounded-full bg-card-foreground/40" />
                    <div className="absolute bottom-0 left-1/2 h-[60%] w-[90%] -translate-x-1/2 rounded-t-[40%] bg-card-foreground/35" />
                  </div>
                </div>
                <div className="absolute inset-x-3 bottom-3 rounded-2xl bg-gradient-to-t from-card-foreground/85 to-card-foreground/60 px-4 py-3 backdrop-blur">
                  <p className="text-base font-semibold text-white">{t.role}</p>
                  <p className="text-xs text-white/80">{t.name}</p>
                </div>
              </FadeUp>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
