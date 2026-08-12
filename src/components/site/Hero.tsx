import { ArrowDown, Calendar, Facebook, Linkedin, Mail, Sparkles, Youtube, BarChart3 } from "lucide-react";
import portraitAsset from "@/assets/pias-islam.jpg.asset.json";

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
          <Sparkles className="absolute -top-4 right-2 hidden size-5 text-accent lg:block" />
          <div
            aria-hidden
            className="absolute inset-x-[-6%] top-1/3 hidden h-56 rounded-[50%] border border-border/70 lg:block"
            style={{ transform: "rotate(-12deg)" }}
          />
          <div className="relative overflow-hidden rounded-3xl border border-border bg-surface">
            <img
              src={portraitAsset.url}
              alt="Pias Ahmed, brand builder and marketing consultant"
              width={960}
              height={960}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="panel mt-[-3rem] ml-auto hidden w-[min(20rem,100%)] items-center gap-3 p-4 backdrop-blur lg:flex">
            <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-accent">
              <BarChart3 className="size-5" />
            </span>
            <p className="text-sm leading-snug">
              Focused on <span className="text-mint">business growth</span>,
              <br />
              not vanity metrics.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
