import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { PageHeader } from "@/components/site/PageHeader";
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
    <PageShell>
      <PageHeader label="FAQ" title="What everyone asks me">
        Straight answers about how I work, pricing, timelines and results.
      </PageHeader>

      <section className="border-b border-line px-6 py-8 sm:px-10 lg:px-16 lg:py-10 xl:px-20">
        <div className="mx-auto max-w-[820px]">
          <Accordion type="single" collapsible>
            {faqs.map((f, i) => (
              <AccordionItem key={f.q} value={`item-${i}`} className="border-line">
                <AccordionTrigger className="py-4 text-left font-display text-base font-bold hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="max-w-[68ch] pb-4 text-sm leading-relaxed text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <Testimonials title="Straight from clients" />

      <section className="px-6 py-10 sm:px-10 lg:px-16 lg:py-14 xl:px-20">
        <h2 className="font-display text-2xl font-extrabold tracking-tight">
          Didn&apos;t find your answer?
        </h2>
        <p className="mt-2 max-w-[46ch] text-sm leading-relaxed text-muted-foreground">
          A quick call is always the easiest way to get a straight answer.
        </p>
        <a
          href="/booking"
          className="mt-5 inline-flex items-center rounded-lg bg-brand px-5 py-3 text-sm font-bold text-brand-foreground transition-colors hover:bg-brand/90"
        >
          Book a strategy call
        </a>
      </section>

      <SiteFooter />
    </PageShell>
  );
}
