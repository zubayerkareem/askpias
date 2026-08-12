import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, TrendingUp } from "lucide-react";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Testimonials } from "@/components/site/Testimonials";

const title = "Case Studies — Pias Ahmed | Marketing Consultant";
const description =
  "Case studies from marketing work with local and international brands — the problem, the system I built, the results and client reviews.";

export const Route = createFileRoute("/case-studies")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "https://askpias.com/case-studies" },
    ],
    links: [{ rel: "canonical", href: "https://askpias.com/case-studies" }],
  }),
  component: CaseStudies,
});

const cases = [
  {
    tag: "E-commerce · Fashion",
    name: "Zarin Lifestyle",
    summary:
      "Meta Ads spend kept climbing while sales stayed flat. We redid the audience research, repositioned the offer and completely rebuilt the landing page and checkout funnel.",
    headline: { label: "ROAS", before: "1.8x", after: "4.3x" },
    stats: [
      { label: "Monthly sales", value: "+190%" },
      { label: "CPA", value: "−42%" },
    ],
  },
  {
    tag: "Service · Healthcare",
    name: "Dhaka Dental Studio",
    summary:
      "Leads were coming in but rarely converted into appointments. We built a full lead system with call scripts, follow-up automation and local search campaigns.",
    headline: { label: "Monthly appointments", before: "46", after: "175" },
    stats: [
      { label: "Cost per lead", value: "−37%" },
      { label: "Show-up rate", value: "81%" },
    ],
  },
  {
    tag: "B2B · SaaS",
    name: "Ledgerly",
    summary:
      "Brand positioning was unclear. We rebuilt the messaging framework, launched a content funnel and Google Ads, and optimised the trial-to-paid journey.",
    headline: { label: "Trial → paid", before: "9%", after: "23%" },
    stats: [
      { label: "Qualified demos", value: "+210%" },
      { label: "Pipeline", value: "$2.6M" },
    ],
  },
  {
    tag: "Retail · FMCG",
    name: "Green Basket",
    summary:
      "Repeat purchases were low. We increased customer lifetime value with a retention system, bundle offers and retargeting sequences.",
    headline: { label: "Customer LTV", before: "1x", after: "1.9x" },
    stats: [
      { label: "Repeat orders", value: "+134%" },
      { label: "Ad cost share", value: "−28%" },
    ],
  },
];

function CaseStudies() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <main className="page-enter">
        <section className="relative overflow-hidden border-b border-border">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-32 left-1/2 size-[420px] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
            style={{ background: "radial-gradient(circle, var(--primary), transparent 65%)" }}
          />
          <div className="mx-auto max-w-6xl px-5 py-16 text-center lg:py-24">
            <p className="eyebrow text-mint">Case studies</p>
            <h1 className="mx-auto mt-4 max-w-2xl text-3xl sm:text-4xl lg:text-5xl">
              I let the results do the talking
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
              A few brand stories below — what the problem was, the system I
              built, and the results that followed.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-16">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {cases.map((c) => (
              <article
                key={c.name}
                className="group flex flex-col rounded-2xl border border-border panel-card p-6 transition-colors hover:border-primary/50"
              >
                <p className="eyebrow text-accent">{c.tag}</p>
                <h2 className="mt-3 text-lg leading-snug">{c.name}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                  {c.summary}
                </p>

                <div className="mt-5 flex items-center gap-3 rounded-xl border border-border bg-surface-2 p-3.5">
                  <div className="flex-1 text-center">
                    <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-muted-foreground">
                      Before
                    </p>
                    <p className="mt-1 text-base font-bold text-muted-foreground line-through decoration-muted-foreground/50">
                      {c.headline.before}
                    </p>
                  </div>
                  <ArrowRight className="size-4 shrink-0 text-accent" />
                  <div className="flex-1 text-center">
                    <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-accent">
                      After
                    </p>
                    <p className="mt-1 text-base font-bold text-foreground">{c.headline.after}</p>
                  </div>
                </div>
                <p className="mt-2 text-center text-[0.7rem] text-muted-foreground">
                  {c.headline.label}
                </p>

                <div className="mt-4 grid flex-1 grid-cols-2 items-end gap-2">
                  {c.stats.map((s) => (
                    <div key={s.label} className="rounded-lg border border-border bg-surface-2 px-3 py-2">
                      <p className="text-[0.65rem] text-muted-foreground">{s.label}</p>
                      <p className="mt-0.5 flex items-center gap-1 text-sm font-bold text-accent">
                        <TrendingUp className="size-3.5 shrink-0" />
                        {s.value}
                      </p>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <Testimonials />

        <section className="mx-auto max-w-6xl px-5 pb-24">
          <div className="panel flex flex-col items-center gap-5 p-9 text-center">
            <h2 className="text-2xl">Your brand could be next on this list</h2>
            <a
              href="/booking"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow transition-opacity hover:opacity-90"
            >
              Book a free strategy call
              <ArrowUpRight className="size-4" />
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
