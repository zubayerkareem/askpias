import { Award, Briefcase, ChevronDown, Target } from "lucide-react";
import { useState } from "react";

const facts = [
  {
    icon: Award,
    title: "5+ years in marketing & business growth",
    body: "Worked with 20+ local and international brands",
  },
  {
    icon: Briefcase,
    title: "Founder of Branding Curve",
    body: "A growth-focused marketing agency",
  },
  {
    icon: Target,
    title: "Specialisation",
    body: "Meta Ads, Google Ads, strategy, conversion, brand positioning and scaling systems",
  },
];

export function Story() {
  const [open, setOpen] = useState(false);

  return (
    <section id="story" className="mx-auto max-w-6xl px-5">
      <div className="panel grid gap-10 p-7 sm:p-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="eyebrow flex items-center gap-2 text-accent">
            <span className="size-1.5 rounded-full bg-accent" />
            My story
          </p>
          <h2 className="mt-4 text-3xl sm:text-[2.1rem]">
            From curiosity to real impact.
          </h2>
          <p className="mt-5 text-muted-foreground">
            I wasn't born into a business family and luck wasn't on my side. It
            all started with curiosity — a stubborn need to understand what
            actually makes a business grow.
          </p>
          {open && (
            <p className="mt-4 text-muted-foreground">
              My first few years were hands-on: running ads for small brands,
              breaking and rebuilding funnels, reading data every single day.
              Then it clicked — great marketing isn't just creative work, it's a
              system. Today I build exactly that for brands: systems that keep
              working even when the owner is asleep.
            </p>
          )}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-accent"
          >
            {open ? "Show less" : "Read the full story"}
            <ChevronDown
              className={`size-4 transition-transform ${open ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        <div className="space-y-7">
          {facts.map((f) => (
            <div key={f.title} className="flex gap-4">
              <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-accent">
                <f.icon className="size-5" />
              </span>
              <div>
                <h3 className="text-base">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
