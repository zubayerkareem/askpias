import { Forward, Lock, MessageCircle, Zap } from "lucide-react";
import { dummyImage, type Note } from "@/lib/notes-data";

/** One row in the Notes list — shared between the /notes page and the homepage preview. */
export function NoteRow({ note }: { note: Note }) {
  return (
    <article className="group flex items-start gap-4 border-b border-border py-5 first:pt-0">
      <img
        src={dummyImage(note.slug)}
        alt=""
        width={80}
        height={80}
        className="size-20 shrink-0 rounded-lg object-cover"
      />
      <div className="min-w-0 flex-1">
        <h3 className="flex items-start gap-1.5 text-base leading-snug font-semibold">
          {note.featured && (
            <Zap className="mt-0.5 size-4 shrink-0 fill-mint text-mint" />
          )}
          <span className="line-clamp-2">{note.title}</span>
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
          {note.excerpt}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
          <span>{note.date}</span>
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
              {note.commentCount}
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
