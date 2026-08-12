import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Testimonials } from "@/components/site/Testimonials";
import { dummyImage } from "@/lib/notes-data";

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
    slug: "zarin-lifestyle",
    name: "Zarin Lifestyle",
    tags: ["E-commerce", "Fashion", "Meta Ads"],
    summary:
      "Meta Ads spend kept climbing while sales stayed flat. We redid the audience research, repositioned the offer and completely rebuilt the landing page and checkout funnel.",
  },
  {
    slug: "dhaka-dental-studio",
    name: "Dhaka Dental Studio",
    tags: ["Service", "Healthcare", "Lead Generation"],
    summary:
      "Leads were coming in but rarely converted into appointments. We built a full lead system with call scripts, follow-up automation and local search campaigns.",
  },
  {
    slug: "ledgerly",
    name: "Ledgerly",
    tags: ["B2B", "SaaS", "Brand Positioning"],
    summary:
      "Brand positioning was unclear. We rebuilt the messaging framework, launched a content funnel and Google Ads, and optimised the trial-to-paid journey.",
  },
  {
    slug: "green-basket",
    name: "Green Basket",
    tags: ["Retail", "FMCG", "Retention"],
    summary:
      "Repeat purchases were low. We increased customer lifetime value with a retention system, bundle offers and retargeting sequences.",
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
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {cases.map((c) => (
              <article
                key={c.slug}
                className="group flex flex-col overflow-hidden rounded-xl border border-border panel-card transition-colors hover:border-primary/50"
              >
                <img
                  src={dummyImage(c.slug)}
                  alt=""
                  width={400}
                  height={225}
                  className="aspect-video w-full object-cover"
                />
                <div className="flex flex-1 flex-col p-6">
                  <h2 className="text-lg leading-snug">{c.name}</h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                    {c.summary}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {c.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-secondary px-2 py-0.5 text-[0.7rem] font-medium text-secondary-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
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
