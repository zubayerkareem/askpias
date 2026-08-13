import { Forward, Lock, MessageCircle, Zap } from "lucide-react";
import { format } from "date-fns";
import { dummyImage, type Note } from "@/lib/notes-data";

/** One row in the Notes list — shared between the /notes page and the homepage preview. */
export function NoteRow({ note }: { note: Note }) {
  return (
    <article className="group flex items-start gap-4 border-b border-border py-5 first:pt-0">
      <img
        src={note.image_url ?? dummyImage(note.slug)}
        alt=""
        width={80}
        height={80}
        className="size-20 shrink-0 rounded-lg object-cover"
      />
      <div className="min-w-0 flex-1">
        <h3 className="flex items-start gap-1.5 text-base leading-snug font-semibold">
          {note.featured && <Zap className="mt-0.5 size-4 shrink-0 fill-mint text-mint" />}
          <span className="line-clamp-2">{note.title}</span>
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{note.excerpt}</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
          <span>{format(new Date(note.published_at), "d MMMM yyyy")}</span>
          <span aria-hidden>/</span>
          <span>Pias Ahmed</span>
          <span className="rounded-full bg-secondary px-2 py-0.5 text-[0.7rem] font-medium text-secondary-foreground">
            {note.category}
          </span>
          {note.locked ? (
            <Lock className="size-3.5" aria-label="Members only" />
          ) : (
            <span className="flex items-center gap-1">
              <MessageCircle className="size-3.5" />
              {note.comment_count}
            </span>
          )}
        </div>
      </div>
      <Forward
        className="mt-1 hidden size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 sm:block"
        aria-hidden
      />
    </article>
  );
}

/** Loading placeholder matching NoteRow's layout, using the site's skeleton-shimmer utility. */
export function NoteRowSkeleton() {
  return (
    <div className="flex items-start gap-4 border-b border-border py-5 first:pt-0">
      <div className="skeleton-shimmer size-20 shrink-0 rounded-lg" />
      <div className="min-w-0 flex-1 space-y-2">
        <div className="skeleton-shimmer h-5 w-4/5 rounded-md" />
        <div className="skeleton-shimmer h-4 w-full rounded-md" />
        <div className="skeleton-shimmer mt-3 h-3.5 w-1/2 rounded-md" />
      </div>
    </div>
  );
}
