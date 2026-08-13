import { createFileRoute, Link } from "@tanstack/react-router";
import { NoteEditorForm } from "@/components/admin/NoteEditorForm";
import { useNote } from "@/hooks/use-notes";

export const Route = createFileRoute("/admin/_authenticated/notes/$id")({
  component: NoteEditRoute,
});

function NoteEditRoute() {
  const { id } = Route.useParams();
  const { data: note, isPending, error } = useNote(id);

  if (isPending) {
    return <div className="skeleton-shimmer h-[500px] w-full rounded-xl" />;
  }

  if (error || !note) {
    return (
      <div className="rounded-xl border border-border p-8 text-center">
        <p className="text-sm text-muted-foreground">Note not found.</p>
        <Link to="/admin/notes" className="mt-3 inline-block text-sm font-semibold text-accent">
          Back to notes
        </Link>
      </div>
    );
  }

  return <NoteEditorForm note={note} />;
}
