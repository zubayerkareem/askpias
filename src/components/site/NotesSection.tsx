import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { NoteCard } from "@/components/site/NoteCard";
import { Reveal } from "@/components/site/Reveal";
import { useNotes } from "@/hooks/use-notes";

const PREVIEW_COUNT = 3;

export function NotesSection() {
  const { data } = useNotes();
  const notes = data ?? [];
  const preview = notes.slice(0, PREVIEW_COUNT);

  return (
    <section className="canvas-grid border-t border-border">
      <div className="mx-auto max-w-[1180px] px-4 py-14 sm:px-6 sm:py-20">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
            <div>
              <p className="label">Notes</p>
              <h2 className="h-section mt-3 max-w-[18ch]">
                Thinking out <span className="text-accent-text">loud</span>
              </h2>
              <p className="mt-4 max-w-[52ch] text-base text-muted-foreground">
                Practical lessons pulled straight from real client work.
              </p>
            </div>
            <Link
              to="/notes"
              className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-bold transition-colors hover:border-brand/60 hover:bg-foreground/5"
            >
              All notes
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-1"
                aria-hidden
              />
            </Link>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {preview.map((n, i) => (
            <Reveal key={n.slug} delay={i * 90}>
              <NoteCard note={n} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
