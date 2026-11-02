import { Clock, Globe, Lightbulb, ListChecks, Video } from "lucide-react";
import { CalBooking } from "@/components/site/CalBooking";

const perks = [
  { icon: Video, title: "30-minute call", body: "A one-on-one Google Meet session" },
  { icon: Lightbulb, title: "Business diagnosis", body: "We find your real growth opportunities" },
  { icon: ListChecks, title: "Actionable plan", body: "You leave with clear next steps" },
];

const details = [
  { icon: Clock, label: "Duration", value: "30 min" },
  { icon: Globe, label: "Time zone", value: "GMT+6" },
  { icon: Video, label: "Location", value: "Google Meet" },
];

export function Booking() {
  return (
    <section id="booking" className="border-b border-line px-6 py-10 sm:px-10 lg:px-16 lg:py-14 xl:px-20">
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-stretch lg:gap-10">
        <div className="flex flex-col">
          <h2 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
            Book a 1:1 strategy call
          </h2>
          <p className="mt-3 max-w-[40ch] text-sm leading-relaxed text-muted-foreground">
            First I understand your business, then together we map out how to grow it.
          </p>

          <ul className="mt-6 border-t border-line">
            {perks.map((p) => (
              <li key={p.title} className="flex gap-3 border-b border-line py-3.5">
                <p.icon className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
                <div>
                  <p className="text-sm font-semibold">{p.title}</p>
                  <p className="text-sm text-muted-foreground">{p.body}</p>
                </div>
              </li>
            ))}
          </ul>

          <dl className="mt-6 grid grid-cols-3 gap-4 lg:mt-auto lg:pt-8">
            {details.map((d) => (
              <div key={d.label}>
                <dt className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                  <d.icon className="size-3.5" aria-hidden />
                  {d.label}
                </dt>
                <dd className="mt-1 font-display text-sm font-bold">{d.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Fixed height so the calendar and the copy column line up. */}
        <div className="flex h-[520px] flex-col overflow-hidden rounded-xl border border-line bg-page lg:h-[540px]">
          <div className="min-h-0 flex-1 overflow-hidden">
            <CalBooking />
          </div>
          <p className="border-t border-line px-4 py-3 text-xs text-muted-foreground">
            Trouble loading the calendar? Email{" "}
            <a
              href="mailto:pias@askpias.com"
              className="font-semibold text-brand underline decoration-brand/30 underline-offset-2"
            >
              pias@askpias.com
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
