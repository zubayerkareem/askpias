import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Clock } from "lucide-react";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Testimonials } from "@/components/site/Testimonials";

const title = "Blog — Marketing & Growth Notes | Pias Ahmed";
const description =
  "Practical articles on marketing strategy, performance ads, conversion funnels and brand positioning, written from real client work.";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "https://askpias.com/blog" },
    ],
    links: [{ rel: "canonical", href: "https://askpias.com/blog" }],
  }),
  component: Blog,
});

const posts = [
  {
    category: "Strategy",
    date: "12 July 2026",
    read: "7 min",
    title: "5 questions you must answer before spending on ads",
    excerpt:
      "Most businesses start with ads while the real problem sits in the offer and the message. Answer these five questions and you'll waste far less budget.",
  },
  {
    category: "Conversion",
    date: "28 June 2026",
    read: "6 min",
    title: "Traffic is coming to your landing page but nobody buys — why?",
    excerpt:
      "Low conversion is rarely a design problem. It's usually a lack of clarity and trust. Explained with real examples.",
  },
  {
    category: "Performance marketing",
    date: "14 June 2026",
    read: "9 min",
    title: "A practical framework for increasing ROAS on Meta Ads",
    excerpt:
      "Creative testing, audience structure and budget scaling — the three-step system I use with every client.",
  },
  {
    category: "Branding",
    date: "30 May 2026",
    read: "5 min",
    title: "Brand positioning is not your logo",
    excerpt:
      "Positioning is the space you own in your customer's mind. A simple explanation with real brand examples.",
  },
  {
    category: "Retention",
    date: "18 May 2026",
    read: "8 min",
    title: "Your existing customers are more profitable than new ones",
    excerpt:
      "How to design a repeat purchase system and which metrics actually deserve your attention.",
  },
  {
    category: "Systems",
    date: "2 May 2026",
    read: "6 min",
    title: "Drop the marketing tricks, build a system",
    excerpt:
      "Hacks give you temporary spikes. Systems give you predictable growth. Here's the difference.",
  },
];

function Blog() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <main className="page-enter">
        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-5 py-16 text-center lg:py-20">
            <p className="eyebrow text-mint">Blog</p>
            <h1 className="mt-4 text-3xl sm:text-4xl">
              My notes on marketing and growth
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
              Practical lessons pulled straight from real client work.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-16">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <article
                key={p.title}
                className="group flex flex-col rounded-2xl border border-border panel-card p-6 transition-colors hover:border-primary/50"
              >
                <p className="eyebrow text-accent">{p.category}</p>
                <h2 className="mt-4 text-lg leading-snug">{p.title}</h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {p.excerpt}
                </p>
                <div className="mt-6 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
                  <span>{p.date}</span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="size-3.5" />
                    {p.read}
                  </span>
                </div>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                  Read more
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </article>
            ))}
          </div>
        </section>

        <Testimonials title="Don't just take my word for it" />
      </main>
      <SiteFooter />
    </div>
  );
}
