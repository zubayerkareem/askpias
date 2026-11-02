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

  return (
    <section id="books" className="border-b border-line px-6 py-10 sm:px-10 lg:px-16 lg:py-14 xl:px-20">
      <div className="grid grid-cols-[92px_minmax(0,1fr)] items-start gap-x-4 gap-y-4 rounded-2xl border border-brand/20 bg-brand-soft/70 p-4 sm:grid-cols-[132px_minmax(0,1fr)] sm:gap-x-6 sm:gap-y-5 sm:p-6 lg:grid-cols-[210px_minmax(0,1fr)] lg:items-center lg:gap-x-10 lg:gap-y-6 lg:p-8">
        <div className="col-start-1 row-start-1 w-full max-w-[92px] sm:max-w-[132px] lg:row-span-2 lg:max-w-[210px] lg:self-center">
          {book?.cover_image_url ? (
            <img
              src={book.cover_image_url}
              alt={title}
              className="aspect-[3/4] w-full rounded-r-lg rounded-l-sm object-cover shadow-[0_24px_50px_-24px_rgba(0,0,0,0.55)]"
            />
          ) : (
            <div className="relative aspect-[3/4] overflow-hidden rounded-r-lg rounded-l-sm bg-brand p-3 text-brand-foreground shadow-[0_24px_50px_-24px_rgba(0,0,0,0.55)] sm:p-4">
              <span aria-hidden className="absolute inset-y-0 left-0 w-1.5 bg-black/20" />
              <p className="text-[0.5rem] font-bold tracking-[0.18em] uppercase opacity-80 sm:text-[0.55rem]">
                Meta Ads
              </p>
              <p className="mt-1 font-display text-[0.62rem] leading-[1.1] font-extrabold break-words hyphens-auto sm:text-[0.95rem] lg:text-lg">
                Thermo&shy;dynamics
              </p>
              <p className="mt-1.5 hidden text-[0.6rem] leading-snug opacity-75 sm:block">
                A practical guide to thinking clearly about Meta Ads.
              </p>
              <p className="absolute bottom-3 left-3 text-[0.55rem] font-bold tracking-[0.25em] sm:bottom-4 sm:left-4 sm:text-[0.6rem]">
                P I A S
              </p>
            </div>
          )}
        </div>

        <div className="col-start-2 row-start-1 min-w-0 text-left">
          <p className="text-[0.62rem] font-bold tracking-[0.16em] uppercase text-brand sm:text-[0.68rem]">
            {badge}
          </p>
          <h2 className="mt-1.5 font-display text-[1.06rem] leading-[1.14] font-extrabold tracking-[-0.02em] sm:text-[1.45rem] lg:mt-2 lg:text-[clamp(1.55rem,3vw,2.3rem)] lg:leading-[1.05] lg:tracking-[-0.03em]">
            {subtitle}
          </h2>
          <p className="mt-2 text-[0.8rem] leading-relaxed text-muted-foreground sm:text-sm lg:mt-3 lg:text-base">
            A practical guide to thinking clearly about Meta Ads.
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1 sm:mt-4 lg:mt-5 lg:gap-3">
            <span className="font-display text-xl font-extrabold sm:text-2xl">৳{price}</span>
            <span aria-hidden className="h-4 w-px bg-line" />
            <span className="text-[0.78rem] text-muted-foreground sm:text-sm">
              Ebook + community access
            </span>
          </div>
        </div>

        <div className="col-span-2 row-start-2 grid gap-2.5 sm:grid-cols-2 sm:gap-3 lg:col-span-1 lg:col-start-2 lg:row-start-2 lg:mt-0 lg:flex lg:flex-wrap">
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
            className="group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-5 py-3 text-sm font-bold text-brand-foreground transition-colors hover:bg-brand/90 lg:w-auto"
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
            className="inline-flex w-full items-center justify-center rounded-lg border border-line bg-page px-5 py-3 text-sm font-bold transition-colors hover:bg-surface lg:w-auto"
          >
            Read a sample
          </a>
        </div>
      </div>
    </section>
  );
}
