import { Linkedin } from "lucide-react";
import { useEffect, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

export type Testimonial = {
  headline: string;
  quote: string;
  name: string;
  role: string;
  company: string;
  initials: string;
};

export const testimonials: Testimonial[] = [
  {
    headline: "Sales more than doubled",
    quote:
      "Pias doesn't just run ads — he understands the whole business and builds a system around it. Our sales more than doubled in three months.",
    name: "Sadia Rahman",
    role: "Founder",
    company: "Zarin Lifestyle",
    initials: "SR",
  },
  {
    headline: "No more missed appointments",
    quote:
      "In the very first meeting I realised our problem wasn't marketing, it was follow-up. Since his system went live we don't miss appointments anymore.",
    name: "Dr. Tanvir Hasan",
    role: "Director",
    company: "Dhaka Dental Studio",
    initials: "TH",
  },
  {
    headline: "Our messaging finally clicked",
    quote:
      "Our messaging changed completely. Now prospects tell us on sales calls exactly what we solve.",
    name: "Imran K.",
    role: "Co-founder",
    company: "Ledgerly",
    initials: "IK",
  },
];

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <figure className="panel-card flex h-full flex-col rounded-2xl border border-border p-6">
      <p className="eyebrow text-mint">{t.headline}</p>
      <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
        {t.quote}
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-5">
        <span className="relative inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-accent">
          {t.initials}
          <span className="absolute -right-0.5 -bottom-0.5 inline-flex size-4 items-center justify-center rounded-full bg-[#0A66C2] text-white ring-2 ring-background">
            <Linkedin className="size-2.5" />
          </span>
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{t.name}</p>
          <p className="truncate text-xs text-muted-foreground">
            {t.role}, {t.company}
          </p>
        </div>
        <span className="ml-auto shrink-0 text-[0.65rem] font-bold tracking-wide text-muted-foreground/60 uppercase">
          {t.company}
        </span>
      </figcaption>
    </figure>
  );
}

export function Testimonials({
  title = "What clients say",
  items = testimonials,
}: {
  title?: string;
  items?: Testimonial[];
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!api) return;
    setSelected(api.selectedScrollSnap());
    api.on("select", () => setSelected(api.selectedScrollSnap()));
  }, [api]);

  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      {title && (
        <h2 className="text-center text-2xl sm:text-3xl">{title}</h2>
      )}

      {/* Desktop / tablet: static grid */}
      <div
        className={`hidden gap-5 sm:grid sm:grid-cols-2 lg:grid-cols-3 ${title ? "mt-10" : ""}`}
      >
        {items.map((t) => (
          <TestimonialCard key={t.name} t={t} />
        ))}
      </div>

      {/* Mobile: auto-sliding carousel, one testimonial per slide */}
      <div className={`sm:hidden ${title ? "mt-10" : ""}`}>
        <Carousel
          opts={{ loop: true }}
          plugins={[Autoplay({ delay: 4000, stopOnInteraction: false })]}
          setApi={setApi}
        >
          <CarouselContent>
            {items.map((t) => (
              <CarouselItem key={t.name}>
                <TestimonialCard t={t} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="mt-4 flex justify-center gap-1.5">
          {items.map((t, i) => (
            <button
              key={t.name}
              type="button"
              aria-label={`Go to testimonial ${i + 1}`}
              onClick={() => api?.scrollTo(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === selected ? "w-5 bg-accent" : "w-1.5 bg-border"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
