import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Testimonials } from "@/components/site/Testimonials";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const title = "Frequently Asked Questions — Pias Ahmed";
const description =
  "Answers to the most common questions about how I work, pricing, timelines and the results you can expect.";

export const Route = createFileRoute("/faqs")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "https://askpias.com/faqs" },
    ],
    links: [{ rel: "canonical", href: "https://askpias.com/faqs" }],
  }),
  component: Faqs,
});

const faqs = [
  {
    q: "What exactly do you do?",
    a: "I build marketing systems for brands — audience and offer research, positioning, performance ad campaigns, conversion funnels and scaling processes. My job isn't just running ads, it's standing up the whole growth structure.",
  },
  {
    q: "What kind of businesses do you work with?",
    a: "E-commerce, local service businesses (clinics, schools, restaurants) and B2B/SaaS — mainly companies that already have a proven product or service and want to scale.",
  },
  {
    q: "How does the process start?",
    a: "It starts with a free 30-minute strategy call where I understand your business, numbers and goals. Then I share an audit and a plan — if you like it, we start working together.",
  },
  {
    q: "How long until I see results?",
    a: "Typically the first 2–3 weeks go into system setup and testing. You'll see early signals within the first month, and stable, predictable growth usually shows up over a 90-day cycle.",
  },
  {
    q: "How is pricing decided?",
    a: "It depends on scope — consulting retainer, project-based system build, or full agency management. You get a clear proposal right after the call, with no hidden costs.",
  },
  {
    q: "How much ad budget do I need?",
    a: "Local businesses can usually start from around BDT 30,000 per month. The right budget depends on your market, product margins and goals.",
  },
  {
    q: "Do you guarantee results?",
    a: "Nobody can guarantee specific numbers — anyone who does isn't being honest. What I do guarantee is the process, transparent reporting and decisions driven by data.",
  },
  {
    q: "Do you train in-house teams?",
    a: "Yes. For many clients I build the system, then hand it over with training and SOPs so their own team can run it.",
  },
];

function Faqs() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <main className="page-enter">
        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-5 py-16 text-center lg:py-20">
            <p className="eyebrow text-mint">FAQ</p>
            <h1 className="mt-4 text-3xl sm:text-4xl">What everyone asks me</h1>
            <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
              Straight answers about how I work, pricing, timelines and results.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-5 pt-16">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((f, i) => (
              <AccordionItem
                key={f.q}
                value={`item-${i}`}
                className="rounded-2xl border border-border bg-surface px-5"
              >
                <AccordionTrigger className="text-left text-base hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        <Testimonials title="Straight from clients" />

        <section className="mx-auto max-w-3xl px-5 pb-16">
          <div className="panel flex flex-col items-center gap-4 p-8 text-center">
            <h2 className="text-xl">Didn't find your answer?</h2>
            <p className="text-sm text-muted-foreground">
              A quick call is always the easiest way.
            </p>
            <a
              href="/booking"
              className="inline-flex items-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-opacity hover:opacity-90"
            >
              Book a meeting
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
