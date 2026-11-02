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
      <div className="grid gap-6 rounded-2xl border border-brand/20 bg-brand-soft/70 p-5 sm:p-7 lg:grid-cols-[210px_minmax(0,1fr)] lg:items-center lg:gap-10 lg:p-8">
        <div className="mx-auto w-full max-w-[168px] sm:max-w-[190px] lg:max-w-[210px]">
          {book?.cover_image_url ? (
            <img
              src={book.cover_image_url}
              alt={title}
              className="aspect-[3/4] w-full rounded-r-lg rounded-l-sm object-cover shadow-[0_24px_50px_-24px_rgba(0,0,0,0.55)]"
            />
          ) : (
            <div className="relative aspect-[3/4] overflow-hidden rounded-r-lg rounded-l-sm bg-brand p-4 text-brand-foreground shadow-[0_24px_50px_-24px_rgba(0,0,0,0.55)]">
              <span aria-hidden className="absolute inset-y-0 left-0 w-1.5 bg-black/20" />
              <p className="text-[0.55rem] font-bold tracking-[0.18em] uppercase opacity-80">
                Meta Ads
              </p>
              <p className="mt-1 font-display text-[0.95rem] leading-[1.05] font-extrabold hyphens-auto sm:text-lg">
                Thermodynamics
              </p>
              <p className="mt-2 text-[0.6rem] leading-snug opacity-75">
                A practical guide to thinking clearly about Meta Ads.
              </p>
              <p className="absolute bottom-4 left-4 text-[0.6rem] font-bold tracking-[0.25em]">
                P I A S
              </p>
            </div>
          )}
        </div>

        <div className="text-center lg:text-left">
          <p className="text-[0.68rem] font-bold tracking-[0.16em] uppercase text-brand">{badge}</p>
          <h2 className="mx-auto mt-2 max-w-[24ch] font-display text-[clamp(1.55rem,3vw,2.3rem)] leading-[1.05] font-extrabold tracking-[-0.03em] lg:mx-0">
            {subtitle}
          </h2>
          <p className="mx-auto mt-3 max-w-[52ch] text-base leading-relaxed text-muted-foreground lg:mx-0">
            A practical guide to thinking clearly about Meta Ads.
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <span className="font-display text-2xl font-extrabold">৳{price}</span>
            <span aria-hidden className="h-4 w-px bg-line" />
            <span className="text-sm text-muted-foreground">Ebook + community access</span>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:flex lg:flex-wrap">
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
      </div>
    </section>
  );
}
