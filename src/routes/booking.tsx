import { createFileRoute } from "@tanstack/react-router";
import { CalendarCheck, Clock, MessageCircle, ShieldCheck } from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { PageHeader } from "@/components/site/PageHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Booking } from "@/components/site/Booking";
import { Testimonials } from "@/components/site/Testimonials";
import { useContactEmail } from "@/hooks/use-site-settings";

const title = "Book a Meeting — Pias Ahmed";
const description =
  "Book a 30-90 minute 1:1 strategy call with Pias Ahmed and walk away with a clear action plan for your brand, marketing and growth.";

export const Route = createFileRoute("/booking")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "https://askpias.com/booking" },
    ],
    links: [{ rel: "canonical", href: "https://askpias.com/booking" }],
  }),
  component: BookingPage,
});

const facts = [
  { icon: Clock, title: "30-90 minutes", body: "Focused, straight to the point" },
  { icon: MessageCircle, title: "No sales pitch", body: "Just your problem and the solution" },
  { icon: ShieldCheck, title: "100% confidential", body: "Your data stays private" },
];

function BookingPage() {
  const email = useContactEmail();

  return (
    <PageShell>
      <PageHeader label="Booking" title="Let's build your growth plan together">
        Pick a day and time that works for you from the calendar below. The call happens online.
      </PageHeader>

      <section className="border-b border-line px-6 py-7 sm:px-10 lg:px-16 xl:px-20">
        <div className="grid gap-4 sm:grid-cols-3">
          {facts.map((f) => (
            <div key={f.title} className="flex gap-3 rounded-xl border border-line p-4">
              <f.icon className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
              <div>
                <p className="text-sm font-semibold">{f.title}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Booking />
      <Testimonials title="What past calls led to" />

      <section className="px-6 py-8 sm:px-10 lg:px-16 xl:px-20">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground sm:items-center">
            <CalendarCheck className="mt-0.5 size-4 shrink-0 text-brand sm:mt-0" aria-hidden />
            Can&apos;t find a slot that works? Email me directly — I reply within 24 hours.
          </p>
          <a
            href={`mailto:${email}`}
            className="inline-flex shrink-0 items-center rounded-lg border border-line px-5 py-3 text-sm font-bold transition-colors hover:bg-surface"
          >
            Send an email
          </a>
        </div>
      </section>

      <SiteFooter />
    </PageShell>
  );
}
