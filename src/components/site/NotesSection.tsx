import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { NoteRow } from "@/components/site/NoteRow";
import { notes } from "@/lib/notes-data";

const PREVIEW_COUNT = 4;

export function NotesSection() {
  const preview = notes.slice(0, PREVIEW_COUNT);

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
        {preview.map((n) => (
          <NoteRow key={n.slug} note={n} />
        ))}
      </div>
    </section>
  );
}
