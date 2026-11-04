import { ArrowRight } from "lucide-react";
import { useBooks } from "@/hooks/use-books";
import { analytics } from "@/lib/analytics";

export function Ebook() {
  const { data } = useBooks();
  const book = data?.find((b) => b.is_featured) ?? data?.[0] ?? null;

  const href = book ? `/books/${book.slug}` : "/books";
  const title = book?.title ?? "Meta Ads Thermodynamics";
  const subtitle = book?.subtitle ?? "Understand the science behind better ads.";
  const price = book?.price ?? 298;
  const badge = book?.badge ?? "Featured ebook";
  const image = book?.featured_image_url ?? book?.cover_image_url ?? null;

  return (
    <section
      id="books"
      className="border-b border-line px-6 py-10 sm:px-10 lg:px-16 lg:py-14 xl:px-20"
    >
      <div className="grid grid-cols-[104px_minmax(0,1fr)] gap-x-3 gap-y-3.5 rounded-xl border border-brand/20 bg-brand-soft p-3.5 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-x-5 sm:p-5 lg:grid-cols-[210px_minmax(0,1fr)] lg:items-center lg:gap-x-10 lg:gap-y-6 lg:p-8">
        <div className="relative col-start-1 row-start-1 h-full lg:row-span-2 lg:h-auto lg:aspect-[3/4] lg:self-center">
          {image ? (
            <img
              src={image}
              alt={title}
              className="absolute inset-0 h-full w-full rounded-md object-cover shadow-[0_18px_34px_-20px_rgba(0,0,0,0.5)]"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col overflow-hidden rounded-md bg-brand p-2.5 text-brand-foreground shadow-[0_18px_34px_-20px_rgba(0,0,0,0.5)] sm:p-3.5">
              <p className="text-[0.5rem] font-bold tracking-[0.14em] uppercase opacity-85 sm:text-[0.55rem]">
                Meta Ads
              </p>
              <p className="mt-1 font-display text-[0.7rem] leading-[1.08] font-extrabold break-words hyphens-auto sm:text-[0.95rem] lg:text-lg">
                Thermo&shy;dynamics
              </p>
              <p className="mt-1.5 hidden text-[0.6rem] leading-snug opacity-75 sm:block">
                A practical guide to thinking clearly about Meta Ads.
              </p>
              <p className="mt-auto pt-2 text-[0.5rem] font-bold tracking-[0.24em] sm:text-[0.6rem]">
                P I A S
              </p>
            </div>
          )}
        </div>

        <div className="col-start-2 row-start-1 min-w-0 text-left">
          <p className="text-[0.66rem] font-bold tracking-[0.14em] uppercase text-brand sm:text-[0.68rem]">
            {badge}
          </p>
          <h2 className="mt-1.5 font-display text-[1.18rem] leading-[1.1] font-extrabold tracking-[-0.02em] sm:text-[1.55rem] lg:mt-2 lg:text-[clamp(1.55rem,3vw,2.3rem)] lg:leading-[1.05] lg:tracking-[-0.03em]">
            {subtitle}
          </h2>
          <p className="mt-2 text-[0.82rem] leading-[1.5] text-muted-foreground sm:text-sm lg:mt-3 lg:text-base">
            A practical guide to thinking clearly about Meta Ads.
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 lg:mt-5 lg:gap-3">
            <span className="font-display text-[1.4rem] leading-none font-extrabold sm:text-[1.7rem]">
              ৳{price}
            </span>
            <span aria-hidden className="h-[18px] w-px bg-foreground/25" />
            <span className="basis-full text-[0.8rem] text-muted-foreground sm:text-sm lg:basis-auto">
              Ebook + community access
            </span>
          </div>
        </div>

        <div className="col-span-2 row-start-2 grid gap-2.5 lg:col-span-1 lg:col-start-2 lg:row-start-2 lg:flex lg:flex-wrap lg:gap-3">
          <a
            href={href}
            onClick={() =>
              analytics.beginCheckout(Number(price), [
                {
                  item_id: book?.slug ?? "meta-ads-thermodynamics",
                  item_name: title,
                  item_category: "ebook",
                  price: Number(price),
                },
              ])
            }
            className="group inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-brand px-5 text-sm font-bold text-brand-foreground transition-colors hover:bg-brand/90 lg:h-auto lg:w-auto lg:py-3"
          >
            Explore the book
            <ArrowRight
              className="size-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden
            />
          </a>
          <a
            href="/books"
            onClick={() => analytics.cta("read_sample", "ebook")}
            className="inline-flex h-11 w-full items-center justify-center rounded-lg border border-line bg-page px-5 text-sm font-bold transition-colors hover:bg-surface lg:h-auto lg:w-auto lg:py-3"
          >
            Read a sample
          </a>
        </div>
      </div>
    </section>
  );
}
