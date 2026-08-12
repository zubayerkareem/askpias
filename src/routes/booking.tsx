import { createFileRoute } from "@tanstack/react-router";
import { CalendarCheck, Clock, MessageCircle, ShieldCheck } from "lucide-react";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Booking } from "@/components/site/Booking";
import { Testimonials } from "@/components/site/Testimonials";

const title = "Book a Meeting — Pias Ahmed";
const description =
  "Book a 30-minute 1:1 strategy call with Pias Ahmed and walk away with a clear action plan for your brand, marketing and growth.";

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
  { icon: Clock, title: "30 minutes", body: "Focused, straight to the point" },
  { icon: MessageCircle, title: "No sales pitch", body: "Just your problem and the solution" },
  { icon: ShieldCheck, title: "100% confidential", body: "Your data stays private" },
];

function BookingPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="page-enter">
        <section className="mx-auto max-w-6xl px-5 pt-14 pb-10">
          <p className="eyebrow text-mint">Booking</p>
          <h1 className="mt-4 max-w-2xl text-4xl leading-[1.2] sm:text-5xl">
            Let's build your <span className="text-gradient">growth plan</span> together
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
            Pick a day and time that works for you from the calendar below. The
            call happens on Google Meet.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {facts.map((f) => (
              <div key={f.title} className="panel flex items-start gap-3 p-5">
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-accent">
                  <f.icon className="size-4" />
                </span>
                <div className="min-w-0">
                  <h2 className="text-sm text-accent">{f.title}</h2>
                  <p className="mt-0.5 text-sm text-muted-foreground">{f.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <Testimonials title="What past calls led to" />

        <Booking />

        <section className="mx-auto max-w-6xl px-5 pb-24">
          <div className="panel flex flex-col items-start gap-4 p-7 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-3 text-sm text-muted-foreground">
              <CalendarCheck className="size-5 shrink-0 text-accent" />
              Can't find a slot that works? Email me directly — I reply within 24 hours.
            </p>
            <a
              href="mailto:pias@askpias.com"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Send an email
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
