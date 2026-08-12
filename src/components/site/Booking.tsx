import {
  CalendarCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Globe,
  Lightbulb,
  ListChecks,
  Video,
} from "lucide-react";
import { useMemo, useState } from "react";

const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const perks = [
  { icon: Video, title: "30-minute call", body: "A one-on-one Google Meet session" },
  { icon: Lightbulb, title: "Business diagnosis", body: "We find your real growth opportunities" },
  { icon: ListChecks, title: "Actionable plan", body: "You leave with clear next steps" },
];

const morningSlots = ["09:30 AM", "10:00 AM", "11:00 AM", "11:30 AM"];
const afternoonSlots = ["01:00 PM", "02:00 PM", "03:30 PM", "05:00 PM"];

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

function formatLong(d: Date) {
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function Booking() {
  const today = useMemo(() => startOfDay(new Date()), []);
  const [viewMonth, setViewMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState<Date | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<{ date: Date; slot: string } | null>(null);

  const monthLabel = viewMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const leading = viewMonth.getDay();
  const daysInMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0).getDate();
  const atFirstMonth =
    viewMonth.getFullYear() === today.getFullYear() && viewMonth.getMonth() === today.getMonth();

  const isUnavailable = (d: Date) => d < today || d.getDay() === 5 || d.getDay() === 6;

  const shiftMonth = (delta: number) => {
    setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() + delta, 1));
  };

  const renderSlotGroup = (label: string, list: string[]) => (
    <div>
      <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {list.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSlot(s)}
            className={`rounded-lg border px-3 py-2.5 text-sm transition-colors ${
              slot === s
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-surface-2 text-foreground hover:border-primary/50"
            }`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );

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

        <div className="rounded-2xl border border-border bg-surface p-6">
          {confirmed ? (
            <div className="flex h-full flex-col items-start justify-center gap-4 py-6">
              <span className="inline-flex size-12 items-center justify-center rounded-full bg-primary/15 text-accent">
                <CheckCircle2 className="size-6" />
              </span>
              <div>
                <h3 className="text-xl">Your call is scheduled</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {formatLong(confirmed.date)} at {confirmed.slot} (GMT+6). A Google Meet link
                  will be shared before the call.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setConfirmed(null);
                  setSelected(null);
                  setSlot(null);
                }}
                className="rounded-lg border border-border px-4 py-2.5 text-sm font-semibold transition-colors hover:border-primary/50"
              >
                Pick another time
              </button>
            </div>
          ) : (
            <>
              <h3 className="text-base">Pick a date and time</h3>
              <div className="mt-6 grid gap-8 sm:grid-cols-[1.3fr_1fr]">
                <div>
                  <div className="flex items-center justify-between text-sm">
                    <button
                      type="button"
                      aria-label="Previous month"
                      disabled={atFirstMonth}
                      onClick={() => shiftMonth(-1)}
                      className="text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
                    >
                      <ChevronLeft className="size-4" />
                    </button>
                    <span className="font-semibold">{monthLabel}</span>
                    <button
                      type="button"
                      aria-label="Next month"
                      onClick={() => shiftMonth(1)}
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <ChevronRight className="size-4" />
                    </button>
                  </div>
                  <div className="mt-5 grid grid-cols-7 gap-y-2 text-center text-[0.7rem] text-muted-foreground">
                    {dayLabels.map((d) => (
                      <span key={d}>{d}</span>
                    ))}
                  </div>
                  <div className="mt-2 grid grid-cols-7 gap-1 text-center text-sm">
                    {Array.from({ length: leading }).map((_, i) => (
                      <span key={`pad-${i}`} />
                    ))}
                    {Array.from({ length: daysInMonth }, (_, i) => {
                      const d = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), i + 1);
                      const disabled = isUnavailable(d);
                      const isSelected = selected?.getTime() === d.getTime();
                      const isToday = d.getTime() === today.getTime();
                      return (
                        <button
                          key={i}
                          type="button"
                          disabled={disabled}
                          aria-label={formatLong(d)}
                          onClick={() => {
                            setSelected(d);
                            setSlot(null);
                          }}
                          className={`mx-auto flex size-8 items-center justify-center rounded-full transition-colors ${
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : disabled
                                ? "cursor-not-allowed text-muted-foreground/35 line-through"
                                : `text-muted-foreground hover:bg-secondary hover:text-foreground ${
                                    isToday ? "ring-1 ring-primary/50" : ""
                                  }`
                          }`}
                        >
                          {i + 1}
                        </button>
                      );
                    })}
                  </div>
                  <p className="mt-4 text-xs text-muted-foreground">
                    Weekends unavailable · Slots shown in GMT+6 (Dhaka)
                  </p>
                </div>

                <div>
                  {selected ? (
                    <>
                      <p className="text-sm font-semibold">{formatLong(selected)}</p>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="size-3.5" />
                        30 min · (GMT+6) Dhaka
                      </p>
                      <div className="mt-4 space-y-4">
                        {renderSlotGroup("Morning", morningSlots)}
                        {renderSlotGroup("Afternoon", afternoonSlots)}
                      </div>
                      <button
                        type="button"
                        disabled={!slot}
                        onClick={() => slot && setConfirmed({ date: selected, slot })}
                        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-3 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <CalendarCheck className="size-4" />
                        Confirm booking
                      </button>
                    </>
                  ) : (
                    <div className="rounded-xl border border-dashed border-border p-5 text-sm text-muted-foreground">
                      Select a date on the calendar to see available times.
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
