import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useCreateNote, useDeleteNote, useNotes, useUpdateNote } from "@/hooks/use-notes";
import { dummyImage, type Note } from "@/lib/notes-data";
import { uploadMedia } from "@/lib/storage";

export const Route = createFileRoute("/admin/_authenticated/notes")({
  component: NotesAdminPage,
});

const noteSchema = z.object({
  title: z.string().trim().min(1, "Required"),
  slug: z
    .string()
    .trim()
    .min(1, "Required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Lowercase letters, numbers and hyphens only"),
  excerpt: z.string().trim().min(1, "Required"),
  category: z.string().trim().min(1, "Required"),
  published_at: z.string().min(1, "Required"),
  comment_count: z.coerce.number().int().min(0),
  featured: z.boolean(),
  locked: z.boolean(),
});

type NoteForm = z.infer<typeof noteSchema>;

const defaultValues: NoteForm = {
  title: "",
  slug: "",
  excerpt: "",
  category: "",
  published_at: format(new Date(), "yyyy-MM-dd"),
  comment_count: 0,
  featured: false,
  locked: false,
};

function NotesAdminPage() {
  const { data: notes, isPending } = useNotes();
  const createNote = useCreateNote();
  const updateNote = useUpdateNote();
  const deleteNote = useDeleteNote();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Note | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Note | null>(null);

  const form = useForm<NoteForm>({
    resolver: zodResolver(noteSchema),
    defaultValues,
  });

  const openCreate = () => {
    setEditing(null);
    setImageFile(null);
    form.reset(defaultValues);
    setDialogOpen(true);
  };

  const openEdit = (n: Note) => {
    setEditing(n);
    setImageFile(null);
    form.reset({
      title: n.title,
      slug: n.slug,
      excerpt: n.excerpt,
      category: n.category,
      published_at: n.published_at,
      comment_count: n.comment_count,
      featured: n.featured,
      locked: n.locked,
    });
    setDialogOpen(true);
  };

  const onSubmit = async (values: NoteForm) => {
    try {
      let image_url = editing?.image_url ?? null;
      if (imageFile) {
        image_url = await uploadMedia(imageFile, "notes", values.slug);
      }

      if (editing) {
        await updateNote.mutateAsync({
          id: editing.id,
          ...values,
          sort_order: editing.sort_order,
          image_url,
        });
      } else {
        const nextSortOrder = (notes?.at(-1)?.sort_order ?? 0) + 10;
        await createNote.mutateAsync({
          ...values,
          sort_order: nextSortOrder,
          image_url,
        });
      }
      toast.success(editing ? "Note updated." : "Note created.");
      setDialogOpen(false);
    } catch {
      toast.error("Something went wrong — please try again.");
    }
  };

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
        <Button type="button" onClick={openCreate}>
          <Plus className="size-4" />
          New note
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
              {notes.map((n) => (
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
                    <Button type="button" variant="ghost" size="icon" onClick={() => openEdit(n)}>
                      <Pencil className="size-4" />
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
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit note" : "New note"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
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
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Excerpt</FormLabel>
                    <FormControl>
                      <Textarea rows={3} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="published_at"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Published date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="comment_count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comment count</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-8">
                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2 space-y-0">
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="!mt-0">Featured</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="locked"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2 space-y-0">
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="!mt-0">Locked (members only)</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2">
                <FormLabel>Image</FormLabel>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                />
              </div>
              <Button
                type="submit"
                disabled={createNote.isPending || updateNote.isPending}
                className="w-full"
              >
                {editing ? "Save changes" : "Create note"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

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
