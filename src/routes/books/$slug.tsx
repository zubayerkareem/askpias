import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { SiteFooter } from "@/components/site/SiteFooter";
import { BookPurchase } from "@/components/site/BookPurchase";
import { bookBySlugQueryOptions } from "@/hooks/use-books";
import { enrichContentHtml } from "@/lib/video";

export const Route = createFileRoute("/books/$slug")({
  loader: async ({ context, params }) => {
    const book = await context.queryClient
      .ensureQueryData(bookBySlugQueryOptions(params.slug))
      .catch(() => null);
    if (!book) throw notFound();
    return book;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const url = `https://askpias.com/books/${loaderData.slug}`;
    return {
      meta: [
        { title: `${loaderData.title} | Pias Ahmed` },
        { name: "description", content: loaderData.subtitle ?? loaderData.title },
        { property: "og:title", content: loaderData.title },
        { property: "og:description", content: loaderData.subtitle ?? loaderData.title },
        { property: "og:url", content: url },
        ...(loaderData.cover_image_url
          ? [{ property: "og:image", content: loaderData.cover_image_url }]
          : []),
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: BookDetail,
});

function BookDetail() {
  const book = Route.useLoaderData();
  const buyUrl = book.buy_url ?? "/booking";
  const price = book.price !== null ? `৳${book.price}` : null;

  return (
    <PageShell>
      <article className="border-b border-line px-6 py-10 sm:px-10 lg:px-16 lg:py-14 xl:px-20">
        <Link to="/books" className="text-sm font-semibold text-brand">
          ← All books
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-12">
          <div className="mx-auto w-full max-w-[200px] lg:mx-0 lg:max-w-none">
            {book.cover_image_url ? (
              <img
                src={book.cover_image_url}
                alt={book.title}
                className="aspect-[3/4] w-full rounded-r-xl rounded-l-sm object-cover shadow-[0_28px_60px_-30px_rgba(0,0,0,0.6)]"
              />
            ) : (
              <div className="relative aspect-[3/4] overflow-hidden rounded-r-xl rounded-l-sm bg-brand p-5 text-brand-foreground shadow-[0_28px_60px_-30px_rgba(0,0,0,0.6)]">
                <span aria-hidden className="absolute inset-y-0 left-0 w-1.5 bg-black/20" />
                <p className="text-[0.6rem] font-bold tracking-[0.2em] uppercase opacity-80">
                  {book.badge ?? "Ebook"}
                </p>
                <p className="mt-2 font-display text-xl leading-[1.05] font-extrabold">
                  {book.title}
                </p>
                <p className="absolute bottom-5 left-5 text-[0.6rem] font-bold tracking-[0.25em]">
                  P I A S
                </p>
              </div>
            )}
          </div>

          <div>
            {book.badge && (
              <p className="text-[0.68rem] font-bold tracking-[0.16em] uppercase text-brand">
                {book.badge}
              </p>
            )}
            <h1 className="mt-2 font-display text-[clamp(1.9rem,4vw,2.8rem)] leading-[1.05] font-extrabold tracking-[-0.03em]">
              {book.title}
            </h1>
            {book.subtitle && (
              <p className="mt-3 max-w-[52ch] text-[1.0625rem] leading-relaxed text-muted-foreground">
                {book.subtitle}
              </p>
            )}

            {price && (
              <div className="mt-5 flex flex-wrap items-baseline gap-3">
                <span className="font-display text-3xl font-extrabold">{price}</span>
                <span className="text-sm text-muted-foreground">
                  {book.features.length > 0 ? book.features[0] : "Digital download"}
                </span>
              </div>
            )}

            {book.features.length > 0 && (
              <ul className="mt-6 space-y-2.5">
                {book.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:flex">
              {book.purchasable && book.price !== null ? (
                <BookPurchase slug={book.slug} title={book.title} price={book.price} />
              ) : (
                <a
                  href={buyUrl}
                  className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-brand px-5 text-sm font-bold text-brand-foreground transition-colors hover:bg-brand/90 lg:w-auto"
                >
                  Buy the book
                </a>
              )}
              <a
                href={book.sample_url ?? "/booking"}
                className="inline-flex h-11 w-full items-center justify-center rounded-lg border border-line bg-page px-5 text-sm font-bold transition-colors hover:bg-surface lg:w-auto"
              >
                Read a sample
              </a>
            </div>
          </div>
        </div>

        {book.description && (
          <div
            className="prose prose-neutral mt-12 max-w-[760px] dark:prose-invert prose-headings:font-display prose-headings:font-extrabold prose-a:text-brand"
            // Safe: `description` is admin-authored HTML from the rich editor.
            dangerouslySetInnerHTML={{ __html: enrichContentHtml(book.description) }}
          />
        )}
      </article>

      <SiteFooter />
    </PageShell>
  );
}
