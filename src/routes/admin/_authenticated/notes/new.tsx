import { createFileRoute } from "@tanstack/react-router";
import { NoteEditorForm } from "@/components/admin/NoteEditorForm";

export const Route = createFileRoute("/admin/_authenticated/notes/new")({
  component: () => <NoteEditorForm />,
});
