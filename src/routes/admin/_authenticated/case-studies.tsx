import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  useCaseStudies,
  useCreateCaseStudy,
  useDeleteCaseStudy,
  useUpdateCaseStudy,
  type CaseStudy,
} from "@/hooks/use-case-studies";
import { dummyImage } from "@/lib/notes-data";
import { uploadMedia } from "@/lib/storage";

export const Route = createFileRoute("/admin/_authenticated/case-studies")({
  component: CaseStudiesAdminPage,
});

const caseStudySchema = z.object({
  name: z.string().trim().min(1, "Required"),
  slug: z
    .string()
    .trim()
    .min(1, "Required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Lowercase letters, numbers and hyphens only"),
  summary: z.string().trim().min(1, "Required"),
  tags: z.string().trim().min(1, "Add at least one tag, comma-separated"),
});

type CaseStudyForm = z.infer<typeof caseStudySchema>;

function CaseStudiesAdminPage() {
  const { data: cases, isPending } = useCaseStudies();
  const createCaseStudy = useCreateCaseStudy();
  const updateCaseStudy = useUpdateCaseStudy();
  const deleteCaseStudy = useDeleteCaseStudy();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<CaseStudy | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CaseStudy | null>(null);

  const form = useForm<CaseStudyForm>({
    resolver: zodResolver(caseStudySchema),
    defaultValues: { name: "", slug: "", summary: "", tags: "" },
  });

  const openCreate = () => {
    setEditing(null);
    setImageFile(null);
    form.reset({ name: "", slug: "", summary: "", tags: "" });
    setDialogOpen(true);
  };

  const openEdit = (c: CaseStudy) => {
    setEditing(c);
    setImageFile(null);
    form.reset({ name: c.name, slug: c.slug, summary: c.summary, tags: c.tags.join(", ") });
    setDialogOpen(true);
  };

  const onSubmit = async (values: CaseStudyForm) => {
    const tags = values.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      let image_url = editing?.image_url ?? null;
      if (imageFile) {
        image_url = await uploadMedia(imageFile, "case-studies", values.slug);
      }

      if (editing) {
        await updateCaseStudy.mutateAsync({
          id: editing.id,
          name: values.name,
          slug: values.slug,
          summary: values.summary,
          tags,
          sort_order: editing.sort_order,
          image_url,
        });
      } else {
        const nextSortOrder = (cases?.at(-1)?.sort_order ?? 0) + 10;
        await createCaseStudy.mutateAsync({
          name: values.name,
          slug: values.slug,
          summary: values.summary,
          tags,
          sort_order: nextSortOrder,
          image_url,
        });
      }
      toast.success(editing ? "Case study updated." : "Case study created.");
      setDialogOpen(false);
    } catch {
      toast.error("Something went wrong — please try again.");
    }
  };

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
        <Button type="button" onClick={openCreate}>
          <Plus className="size-4" />
          New case study
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
              {cases.map((c) => (
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
                    <Button type="button" variant="ghost" size="icon" onClick={() => openEdit(c)}>
                      <Pencil className="size-4" />
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
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit case study" : "New case study"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="summary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Summary</FormLabel>
                    <FormControl>
                      <Textarea rows={3} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags (comma-separated)</FormLabel>
                    <FormControl>
                      <Input placeholder="E-commerce, Fashion, Meta Ads" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-2">
                <Label>Image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                />
              </div>
              <Button
                type="submit"
                disabled={createCaseStudy.isPending || updateCaseStudy.isPending}
                className="w-full"
              >
                {editing ? "Save changes" : "Create case study"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

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
