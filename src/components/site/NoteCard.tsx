import { Zap } from "lucide-react";
import { format } from "date-fns";
import { Link } from "@tanstack/react-router";
import type { Note } from "@/lib/notes-data";

/** Note card — image on the left, copy on the right. */
export function NoteCard({ note }: { note: Note }) {
  return (
    <Link
      to="/notes/$slug"
      params={{ slug: note.slug }}
      className="group flex h-full overflow-hidden rounded-xl border border-line bg-page transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_44px_-32px_rgba(0,0,0,0.5)]"
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

        {note.featured && (
          <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-brand px-2 py-0.5 text-[0.58rem] font-bold text-brand-foreground">
            <Zap className="size-2.5 fill-current" aria-hidden />
            Featured
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
        <h3 className="line-clamp-2 font-display text-base leading-snug font-bold decoration-brand/40 underline-offset-4 group-hover:underline sm:text-lg">
          {note.title}
        </h3>

        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {note.excerpt}
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-3 text-xs font-medium text-muted-foreground">
          <span>{format(new Date(note.published_at), "d MMM yyyy")}</span>
          {note.locked && <span>Members only</span>}
        </div>
      </div>
    </Link>
  );
}
