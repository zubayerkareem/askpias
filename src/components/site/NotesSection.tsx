import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { NoteRow, NoteRowSkeleton } from "@/components/site/NoteRow";
import { useNotes } from "@/hooks/use-notes";

const PREVIEW_COUNT = 3;

export function NotesSection() {
  const { data: notes, isPending } = useNotes();
  const preview = notes?.slice(0, PREVIEW_COUNT) ?? [];

  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-accent">Notes</p>
          <h2 className="mt-3 text-3xl sm:text-[2.1rem]">
            Recent thinking on marketing and growth
          </h2>
        </div>
        <Link
          to="/notes"
          className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-accent"
        >
          View all notes
          <ArrowRight className="size-4" />
        </Link>
      </div>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 sm:gap-x-10">
        {isPending ? (
          Array.from({ length: PREVIEW_COUNT }).map((_, i) => <NoteRowSkeleton key={i} />)
        ) : preview.length > 0 ? (
          preview.map((n) => <NoteRow key={n.slug} note={n} />)
        ) : (
          <p className="text-sm text-muted-foreground">No notes yet — check back soon.</p>
        )}
      </div>
    </section>
  );
}
