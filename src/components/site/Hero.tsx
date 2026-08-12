import { ArrowDown, Calendar, Facebook, Linkedin, Mail, Youtube } from "lucide-react";

const socials = [
  { icon: Linkedin, label: "LinkedIn" },
  { icon: Facebook, label: "Facebook" },
  { icon: Youtube, label: "YouTube" },
  { icon: Mail, label: "Email" },
];

export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-[-10%] size-[520px] rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--primary), transparent 65%)" }}
      />
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 pt-8 pb-20 lg:grid-cols-[1.05fr_0.95fr] lg:pt-24 lg:pb-28">
        <div className="order-2 lg:order-1">
          <p className="eyebrow text-mint">Hi, I'm Pias Ahmed</p>
          <h1 className="mt-4 text-4xl leading-[1.2] sm:text-5xl lg:text-[3.4rem]">
            I build marketing systems that{" "}
            <span className="text-gradient">grow businesses.</span>
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">
            I don't just run ads. I combine strategy, consumer psychology and
            performance data to build predictable growth systems for brands.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="/booking"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow transition-opacity hover:opacity-90"
            >
              <Calendar className="size-4" />
              Schedule a meeting
            </a>
            <a
              href="#story"
              className="inline-flex items-center gap-2 rounded-xl border border-input px-5 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
            >
              Read my story
              <ArrowDown className="size-4" />
            </a>
          </div>

          <p className="mt-10 text-sm text-muted-foreground">Connect with me</p>
          <div className="mt-3 flex gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href="#booking"
                aria-label={s.label}
                className="inline-flex size-11 items-center justify-center rounded-full bg-surface-2 text-muted-foreground transition-colors hover:text-foreground"
              >
                <s.icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <div className="relative order-1 lg:order-2">
          <div
            aria-hidden
            className="absolute inset-x-[-6%] top-1/3 hidden h-56 rounded-[50%] border border-border/70 lg:block"
            style={{ transform: "rotate(-12deg)" }}
          />
          <div className="relative overflow-hidden rounded-3xl border border-border bg-surface">
            <img
              src="/pias-islam.jpg"
              alt="Pias Ahmed, brand builder and marketing consultant"
              width={960}
              height={960}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
