import { ArrowRight, Compass, Gauge, LayoutGrid, Rocket } from "lucide-react";

const services = [
  {
    icon: Compass,
    title: "Strategy first",
    body: "I analyse your business, market and audience, then design a strategy built to win.",
  },
  {
    icon: Rocket,
    title: "Performance marketing",
    body: "Data-driven ad campaigns that deliver real, measurable results.",
  },
  {
    icon: LayoutGrid,
    title: "Conversion systems",
    body: "High-converting funnels and systems designed to maximise ROI.",
  },
  {
    icon: Gauge,
    title: "Scale & optimise",
    body: "I scale what's working and optimise it for predictable growth.",
  },
];

export function Services() {
  return (
    <section id="services" className="mx-auto max-w-6xl px-5 py-24">
      <div className="text-center">
        <p className="eyebrow text-accent">What I do</p>
        <h2 className="mt-3 text-3xl sm:text-[2.1rem]">
          How I help businesses grow
        </h2>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((s) => (
          <article
            key={s.title}
            className="group rounded-2xl border border-border panel-card p-6 transition-colors hover:border-primary/50"
          >
            <span className="inline-flex size-11 items-center justify-center rounded-xl bg-primary/15 text-accent">
              <s.icon className="size-5" />
            </span>
            <h3 className="mt-6 text-base">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {s.body}
            </p>
            <ArrowRight className="mt-6 size-4 text-accent transition-transform group-hover:translate-x-1" />
          </article>
        ))}
      </div>
    </section>
  );
}
