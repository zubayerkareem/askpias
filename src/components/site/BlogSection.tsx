import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { useNotes } from "@/hooks/use-notes";
import { analytics } from "@/lib/analytics";

const PREVIEW_COUNT = 2;

export function BlogSection() {
  const { data } = useNotes();
  const posts = (data ?? []).slice(0, PREVIEW_COUNT);

  if (posts.length === 0) return null;

  return (
    <section className="border-b border-line px-6 py-10 sm:px-10 lg:px-16 lg:py-14 xl:px-20">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
          From the notes
        </h2>
        <Link
          to="/notes"
          className="group inline-flex items-center gap-1.5 text-sm font-semibold text-brand"
        >
          View all
          <ArrowRight
            className="size-4 transition-transform group-hover:translate-x-0.5"
            aria-hidden
          />
        </Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {posts.map((note) => (
          <Link
            key={note.slug}
            to="/notes/$slug"
            params={{ slug: note.slug }}
            onClick={() =>
              analytics.selectItem({ item_id: note.slug, item_name: note.title }, "home_blog")
            }
            className="group flex h-full overflow-hidden rounded-xl border border-line bg-page transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-30px_rgba(0,0,0,0.45)]"
          >
            <div className="relative w-28 shrink-0 overflow-hidden bg-brand-soft sm:w-44">
              {note.image_url ? (
                <img
                  src={note.image_url}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
              ) : (
                <div className="h-full w-full" />
              )}
            </div>

            <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
              <h3 className="line-clamp-2 font-display text-base leading-snug font-bold decoration-brand/40 underline-offset-4 group-hover:underline sm:text-lg">
                {note.title}
              </h3>
              <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                {note.excerpt}
              </p>
              <p className="mt-auto pt-3 text-xs font-medium text-muted-foreground">
                {format(new Date(note.published_at), "d MMM yyyy")}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
