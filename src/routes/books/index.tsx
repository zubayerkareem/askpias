import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { PageHeader } from "@/components/site/PageHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { useBooks } from "@/hooks/use-books";

const title = "Books — Pias Ahmed";
const description =
  "Ebooks and guides by Pias Ahmed on Meta advertising, growth systems and building brands that sell.";

export const Route = createFileRoute("/books/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "https://askpias.com/books" },
    ],
    links: [{ rel: "canonical", href: "https://askpias.com/books" }],
  }),
  component: BooksPage,
});

function BooksPage() {
  const { data } = useBooks();
  const books = data ?? [];

  return (
    <PageShell>
      <PageHeader label="Books" title="Books and guides">
        Practical, no-fluff writing on advertising, growth systems and building brands that sell.
      </PageHeader>

      <section className="border-b border-line px-6 py-10 sm:px-10 lg:px-16 lg:py-14 xl:px-20">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            <Link
              key={book.slug}
              to="/books/$slug"
              params={{ slug: book.slug }}
              className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-page transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_44px_-32px_rgba(0,0,0,0.5)]"
            >
              <div className="flex justify-center bg-brand-soft/60 p-6">
                <div className="w-[140px]">
                  {book.cover_image_url ? (
                    <img
                      src={book.cover_image_url}
                      alt={book.title}
                      className="aspect-[3/4] w-full rounded-r-lg rounded-l-sm object-cover shadow-[0_20px_40px_-22px_rgba(0,0,0,0.55)]"
                    />
                  ) : (
                    <div className="relative aspect-[3/4] overflow-hidden rounded-r-lg rounded-l-sm bg-brand p-3 text-brand-foreground shadow-[0_20px_40px_-22px_rgba(0,0,0,0.55)]">
                      <span aria-hidden className="absolute inset-y-0 left-0 w-1 bg-black/20" />
                      <p className="text-[0.5rem] font-bold tracking-[0.18em] uppercase opacity-80">
                        {book.badge ?? "Ebook"}
                      </p>
                      <p className="mt-1 font-display text-sm leading-tight font-extrabold">
                        {book.title}
                      </p>
                      <p className="absolute bottom-3 left-3 text-[0.5rem] font-bold tracking-[0.25em]">
                        P I A S
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-1 flex-col p-5">
                {book.badge && (
                  <p className="text-[0.65rem] font-bold tracking-[0.14em] uppercase text-brand">
                    {book.badge}
                  </p>
                )}
                <h2 className="mt-1.5 font-display text-lg leading-snug font-bold">
                  {book.title}
                </h2>
                {book.subtitle && (
                  <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {book.subtitle}
                  </p>
                )}

                <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                  <span className="font-display text-lg font-extrabold">
                    {book.price !== null ? `৳${book.price}` : "Coming soon"}
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand">
                    Details
                    <ArrowRight
                      className="size-4 transition-transform group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {books.length === 0 && <p className="text-sm text-muted-foreground">No books published yet.</p>}
      </section>

      <SiteFooter />
    </PageShell>
  );
}
