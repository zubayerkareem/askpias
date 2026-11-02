import { ChevronDown, Compass, Filter, Megaphone, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Reveal } from "@/components/site/Reveal";
import { SiteAvatar } from "@/components/site/SiteAvatar";

const practice = [
  {
    icon: Compass,
    title: "Strategy & positioning",
    body: "Finding what the market actually buys, then naming it so clearly the offer sells itself.",
  },
  {
    icon: Megaphone,
    title: "Meta & Google Ads",
    body: "Paid media run against your unit economics, not vanity metrics or platform dashboards.",
  },
  {
    icon: Filter,
    title: "Conversion funnels",
    body: "Landing pages, follow-up and offers that close the loop between the click and the sale.",
  },
  {
    icon: TrendingUp,
    title: "Scaling systems",
    body: "SOPs, reporting and handover, so your own team can run the machine after I leave.",
  },
];

export function Story() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <section id="story" className="canvas-grid">
        <div className="relative mx-auto max-w-[1180px] overflow-hidden px-4 py-14 sm:px-6 sm:py-20">
          <span
            aria-hidden
            className="pointer-events-none absolute -bottom-10 right-0 hidden font-display text-[12rem] leading-none font-extrabold tracking-tighter text-foreground/[0.05] lg:block"
          >
            GROWTH
          </span>

          <div className="relative max-w-[900px]">
            <p className="text-sm font-bold text-brand">My story</p>

            <h2 className="h-page mt-3 max-w-[16ch]">From curiosity to real impact.</h2>

            <p className="mt-6 max-w-[68ch] font-display text-[clamp(1.35rem,2.6vw,2rem)] leading-[1.35] font-bold tracking-tight">
              I wasn't born into a business family and luck wasn't on my side. It all started with{" "}
              <span className="mark-brand">curiosity</span> — a stubborn need to understand what
              actually makes a business grow.
            </p>

            {open && (
              <p className="mt-5 max-w-[64ch] text-base leading-relaxed text-sheet-muted sm:text-lg">
                My first few years were hands-on: running ads for small brands, breaking and
                rebuilding funnels, reading data every single day. Then it clicked — great marketing
                isn't just creative work, it's a system. Today I build exactly that for brands:
                systems that keep working even when the owner is asleep.
              </p>
            )}

            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                className="group inline-flex items-center gap-1.5 rounded-full bg-[#111114] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-black dark:bg-brand dark:text-brand-foreground dark:hover:bg-brand/90"
              >
                {open ? "Show less" : "Read the full story"}
                <ChevronDown
                  className={`size-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                  aria-hidden
                />
              </button>

              <p className="flex items-center gap-2.5 text-sm font-semibold text-sheet-muted">
                <SiteAvatar
                  alt="Pias Ahmed"
                  width={48}
                  height={48}
                  className="size-8 rounded-full border border-black/10 object-cover"
                />
                Pias Ahmed, Branding Curve
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="canvas-grid relative">
        <div className="mx-auto max-w-[1180px] px-4 py-14 sm:px-6 sm:py-20">
          <Reveal>
            <p className="label">Services</p>
            <h2 className="h-section mt-3 max-w-[18ch]">
              What I can <span className="text-accent-text">help with</span>
            </h2>
            <p className="mt-4 max-w-[56ch] text-base leading-relaxed text-muted-foreground">
              Pick the piece you need, or the whole growth wall. Every engagement is run by me, not
              handed to a junior team.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {practice.map((p, i) => (
              <Reveal key={p.title} delay={i * 80}>
                <div className="group h-full rounded-2xl bg-sheet p-6 text-sheet-foreground shadow-[0_30px_60px_-40px_rgba(0,0,0,0.7)] transition-transform duration-300 hover:-translate-y-1">
                  <span className="inline-flex size-11 items-center justify-center rounded-xl bg-brand text-brand-foreground transition-transform duration-300 group-hover:scale-105">
                    <p.icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="mt-5 font-display text-lg leading-tight font-extrabold">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-sheet-muted">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
