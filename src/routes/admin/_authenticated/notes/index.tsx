import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { useDeleteNote, useNotes } from "@/hooks/use-notes";
import { usePagedList } from "@/hooks/use-paged-list";
import { dummyImage, type Note } from "@/lib/notes-data";

export const Route = createFileRoute("/admin/_authenticated/notes/")({
  component: NotesAdminPage,
});

function NotesAdminPage() {
  const { data: notes, isPending } = useNotes();
  const deleteNote = useDeleteNote();
  const [deleteTarget, setDeleteTarget] = useState<Note | null>(null);
  const { pageItems, page, setPage, totalPages } = usePagedList(notes, 10);

  const onConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteNote.mutateAsync(deleteTarget.id);
      toast.success("Note deleted.");
    } catch {
      toast.error("Couldn't delete — please try again.");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Notes</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Shown on the homepage preview and the /notes page.
          </p>
        </div>
        <Button type="button" asChild>
          <Link to="/admin/notes/new">
            <Plus className="size-4" />
            New note
          </Link>
        </Button>
      </div>

      <div className="mt-6 rounded-xl border border-border">
        {isPending ? (
          <div className="skeleton-shimmer h-48 w-full rounded-xl" />
        ) : notes && notes.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Published</TableHead>
                <TableHead>Flags</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageItems.map((n) => (
                <TableRow key={n.id}>
                  <TableCell className="flex items-center gap-3">
                    <img
                      src={n.image_url ?? dummyImage(n.slug)}
                      alt=""
                      className="size-10 rounded-md object-cover"
                    />
                    {n.title}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{n.category}</TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {format(new Date(n.published_at), "d MMM yyyy")}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {[n.featured && "Featured", n.locked && "Locked"].filter(Boolean).join(", ") ||
                      "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button type="button" variant="ghost" size="icon" asChild>
                      <Link to="/admin/notes/$id" params={{ id: n.id }}>
                        <Pencil className="size-4" />
                      </Link>
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteTarget(n)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="p-6 text-sm text-muted-foreground">No notes yet.</p>
        )}
        {notes && notes.length > 0 && totalPages > 1 && (
          <AdminPagination page={page} totalPages={totalPages} onPageChange={setPage} />
        )}
      </div>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{deleteTarget?.title}"?</AlertDialogTitle>
            <AlertDialogDescription>
              This can't be undone. It will be removed from the site.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
