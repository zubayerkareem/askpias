import { useEffect, useState } from "react";
import { Quote } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useTestimonials, type Testimonial } from "@/hooks/use-testimonials";

function TestimonialCard({ t }: { t: Testimonial }) {
  const initials =
    t.initials ??
    t.name
      .split(" ")
      .map((part) => part[0] ?? "")
      .join("")
      .slice(0, 2)
      .toUpperCase();
  const byline = [t.role, t.company].filter(Boolean).join(", ");

  return (
    <figure className="flex h-full w-full flex-col rounded-xl border border-line bg-page p-5 transition-shadow hover:shadow-[0_18px_40px_-30px_rgba(0,0,0,0.45)]">
      <Quote className="size-6 text-brand/70" aria-hidden />

      <p className="mt-3 font-display text-base leading-snug font-bold">{t.headline}</p>

      <blockquote className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
        &ldquo;{t.quote}&rdquo;
      </blockquote>

      <figcaption className="mt-5 flex items-center gap-3 border-t border-line pt-4">
        {initials && (
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-soft font-display text-[0.65rem] font-extrabold text-brand">
            {initials}
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{t.name}</p>
          {byline && <p className="truncate text-xs text-muted-foreground">{byline}</p>}
        </div>
      </figcaption>
    </figure>
  );
}

export function Testimonials({
  title = "What clients say",
  items,
}: {
  title?: string;
  items?: Testimonial[];
}) {
  const { data } = useTestimonials();
  const list = items ?? data ?? [];

  const [api, setApi] = useState<CarouselApi>();
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!api) return;
    const update = () => setSelected(api.selectedScrollSnap());
    update();
    api.on("select", update);
    api.on("reInit", update);
    return () => {
      api.off("select", update);
      api.off("reInit", update);
    };
  }, [api]);

  useEffect(() => {
    if (!api) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => api.scrollNext(), 4500);
    return () => window.clearInterval(id);
  }, [api]);

  if (list.length === 0) return null;

  return (
    <section className="border-b border-line px-6 py-10 sm:px-10 lg:px-16 lg:py-14 xl:px-20">
      <h2 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h2>

      <div className="mt-6 hidden gap-4 md:grid md:grid-cols-2 lg:grid-cols-3">
        {list.map((t) => (
          <TestimonialCard key={`${t.name}-${t.headline}`} t={t} />
        ))}
      </div>

      <div className="mt-6 lg:hidden">
        <Carousel opts={{ loop: true, align: "start" }} setApi={setApi}>
          <CarouselContent>
            {list.map((t) => (
              <CarouselItem key={`${t.name}-${t.headline}`}>
                <TestimonialCard t={t} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="mt-4 flex justify-center gap-1.5">
          {list.map((t, i) => (
            <button
              key={`${t.name}-${t.headline}`}
              type="button"
              aria-label={`Go to testimonial ${i + 1}`}
              aria-current={i === selected}
              onClick={() => api?.scrollTo(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === selected ? "w-6 bg-brand" : "w-1.5 bg-foreground/25"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
