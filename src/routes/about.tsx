import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Award, Compass, Filter, Megaphone, TrendingUp, Users } from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { PageHeader } from "@/components/site/PageHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteAvatar } from "@/components/site/SiteAvatar";

const title = "About Pias Ahmed — Brand Builder & Marketing Consultant";
const description =
  "Pias Ahmed is a brand builder and growth marketer in Dhaka, founder of Branding Curve. Strategy, performance media and conversion systems for brands that want to scale.";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "https://askpias.com/about" },
    ],
    links: [{ rel: "canonical", href: "https://askpias.com/about" }],
  }),
  component: AboutPage,
});

const practice = [
  { icon: Compass, title: "Strategy & positioning", body: "Finding what the market actually buys, then naming it clearly." },
  { icon: Megaphone, title: "Meta & Google Ads", body: "Paid media run against unit economics, not vanity metrics." },
  { icon: Filter, title: "Conversion funnels", body: "Landing pages, follow-up and offers that close the loop." },
  { icon: TrendingUp, title: "Scaling systems", body: "SOPs and reporting your team can run without me." },
];

const facts = [
  { value: "5+", label: "years in marketing & growth" },
  { value: "20+", label: "brands served" },
  { value: "90", label: "days to steady growth" },
];

function AboutPage() {
  return (
    <PageShell>
      <PageHeader label="About" title="I build marketing systems that grow businesses">
        I&apos;m Pias Ahmed — a brand builder and growth marketer based in Dhaka, and the founder
        of Branding Curve. I help founders turn scattered marketing into a system that compounds.
      </PageHeader>

      <section className="border-b border-line px-6 py-10 sm:px-10 lg:px-16 lg:py-14 xl:px-20">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <figure className="mx-auto w-full max-w-[320px] lg:max-w-none">
            <div className="overflow-hidden rounded-xl border border-line bg-surface">
              <SiteAvatar
                alt="Pias Ahmed"
                width={900}
                height={1125}
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
            <figcaption className="mt-3 flex flex-wrap items-baseline justify-between gap-x-4 border-t border-line pt-3">
              <span className="font-display text-sm font-semibold">Pias Ahmed</span>
              <span className="text-xs text-muted-foreground">Dhaka, Bangladesh</span>
            </figcaption>
          </figure>

          <div>
            <h2 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
              From curiosity to real impact
            </h2>

            <div className="mt-5 max-w-[62ch] space-y-4 text-[1.0625rem] leading-relaxed text-muted-foreground">
              <p>
                I wasn&apos;t born into a business family and luck wasn&apos;t on my side. It all
                started with curiosity — a stubborn need to understand what actually makes a
                business grow.
              </p>
              <p>
                My first few years were hands-on: running ads for small brands, breaking and
                rebuilding funnels, reading data every single day. Then it clicked — great marketing
                isn&apos;t just creative work, it&apos;s a system.
              </p>
              <p>
                Today I build exactly that for brands: positioning, paid media, conversion funnels
                and the reporting that keeps it all honest.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <Award className="size-4" aria-hidden /> 5 Years in Marketing
              </span>
              <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="size-4" aria-hidden /> 20+ Brands Worked With
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-line px-6 py-10 sm:px-10 lg:px-16 lg:py-14 xl:px-20">
        <h2 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
          What I do
        </h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {practice.map((p) => (
            <div key={p.title} className="rounded-xl border border-line bg-page p-5">
              <span className="grid size-10 place-items-center rounded-lg bg-brand-soft text-brand">
                <p.icon className="size-5" aria-hidden />
              </span>
              <h3 className="mt-4 font-display text-base font-bold">{p.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
            </div>
          ))}
        </div>

        <dl className="mt-8 grid gap-4 sm:grid-cols-3">
          {facts.map((f) => (
            <div key={f.label} className="rounded-xl border border-line bg-page p-5">
              <dt className="font-display text-3xl font-extrabold tracking-tight">{f.value}</dt>
              <dd className="mt-1 text-sm text-muted-foreground">{f.label}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="px-6 py-10 sm:px-10 lg:px-16 lg:py-14 xl:px-20">
        <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-display text-2xl font-extrabold tracking-tight">
              Let&apos;s look at your numbers
            </h2>
            <p className="mt-2 max-w-[46ch] text-sm leading-relaxed text-muted-foreground">
              Book a free 30-minute call, or send a message and I&apos;ll reply personally.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/booking"
              className="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-3 text-sm font-bold text-brand-foreground transition-colors hover:bg-brand/90"
            >
              Book a call
              <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center rounded-lg border border-line px-5 py-3 text-sm font-bold transition-colors hover:bg-surface"
            >
              Contact me
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </PageShell>
  );
}
