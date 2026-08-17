import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
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
import { useCaseStudies, useDeleteCaseStudy, type CaseStudy } from "@/hooks/use-case-studies";
import { usePagedList } from "@/hooks/use-paged-list";
import { dummyImage } from "@/lib/notes-data";

export const Route = createFileRoute("/admin/_authenticated/case-studies/")({
  component: CaseStudiesAdminPage,
});

function CaseStudiesAdminPage() {
  const { data: cases, isPending } = useCaseStudies();
  const deleteCaseStudy = useDeleteCaseStudy();
  const [deleteTarget, setDeleteTarget] = useState<CaseStudy | null>(null);
  const { pageItems, page, setPage, totalPages } = usePagedList(cases, 10);

  const onConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteCaseStudy.mutateAsync(deleteTarget.id);
      toast.success("Case study deleted.");
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
          <h1 className="text-2xl font-semibold">Case studies</h1>
          <p className="mt-1 text-sm text-muted-foreground">Shown on the /case-studies page.</p>
        </div>
        <Button type="button" asChild>
          <Link to="/admin/case-studies/new">
            <Plus className="size-4" />
            New case study
          </Link>
        </Button>
      </div>

      <div className="mt-6 rounded-xl border border-border">
        {isPending ? (
          <div className="skeleton-shimmer h-48 w-full rounded-xl" />
        ) : cases && cases.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageItems.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="flex items-center gap-3">
                    <img
                      src={c.image_url ?? dummyImage(c.slug)}
                      alt=""
                      className="size-10 rounded-md object-cover"
                    />
                    {c.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{c.tags.join(", ")}</TableCell>
                  <TableCell className="text-right">
                    <Button type="button" variant="ghost" size="icon" asChild>
                      <Link to="/admin/case-studies/$id" params={{ id: c.id }}>
                        <Pencil className="size-4" />
                      </Link>
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteTarget(c)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="p-6 text-sm text-muted-foreground">No case studies yet.</p>
        )}
        {cases && cases.length > 0 && totalPages > 1 && (
          <AdminPagination page={page} totalPages={totalPages} onPageChange={setPage} />
        )}
      </div>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{deleteTarget?.name}"?</AlertDialogTitle>
            <AlertDialogDescription>
              This can't be undone. It will be removed from the public Case Studies page.
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
