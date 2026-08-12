import { Clock, Globe, Lightbulb, ListChecks, Video } from "lucide-react";
import { CalBooking } from "@/components/site/CalBooking";

const perks = [
  { icon: Video, title: "30-minute call", body: "A one-on-one Google Meet session" },
  { icon: Lightbulb, title: "Business diagnosis", body: "We find your real growth opportunities" },
  { icon: ListChecks, title: "Actionable plan", body: "You leave with clear next steps" },
];

export function Booking() {
  return (
    <section id="booking" className="mx-auto max-w-6xl px-5 pb-24">
      <div className="panel grid gap-10 p-7 sm:p-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="eyebrow text-accent">Let's talk</p>
          <h2 className="mt-3 text-3xl">Book a 1:1 strategy call</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            First I understand your business, then together we map out how to grow it.
          </p>
          <div className="mt-8 space-y-6">
            {perks.map((p) => (
              <div key={p.title} className="flex gap-4">
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-accent">
                  <p.icon className="size-4" />
                </span>
                <div>
                  <h3 className="text-sm text-accent">{p.title}</h3>
                  <p className="mt-0.5 text-sm text-muted-foreground">{p.body}</p>
                </div>
              </div>
            ))}
          </div>

          <dl className="mt-8 space-y-2 rounded-xl border border-border bg-surface-2 p-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="size-3.5 text-accent" />
              <dt className="text-muted-foreground">Duration</dt>
              <dd className="ml-auto font-semibold">30 min</dd>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="size-3.5 text-accent" />
              <dt className="text-muted-foreground">Time zone</dt>
              <dd className="ml-auto font-semibold">GMT+6 · Dhaka</dd>
            </div>
            <div className="flex items-center gap-2">
              <Video className="size-3.5 text-accent" />
              <dt className="text-muted-foreground">Location</dt>
              <dd className="ml-auto font-semibold">Google Meet</dd>
            </div>
          </dl>
        </div>

        <div className="min-h-[650px] overflow-hidden rounded-xl border border-border bg-surface">
          <CalBooking />
        </div>
      </div>
    </section>
  );
}
