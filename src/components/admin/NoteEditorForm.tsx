import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { format } from "date-fns";
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
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { useCreateNote, useNotes, useUpdateNote } from "@/hooks/use-notes";
import { dummyImage, type Note } from "@/lib/notes-data";
import { uploadMedia } from "@/lib/storage";

const noteSchema = z.object({
  title: z.string().trim().min(1, "Required"),
  slug: z
    .string()
    .trim()
    .min(1, "Required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Lowercase letters, numbers and hyphens only"),
  excerpt: z.string().trim().min(1, "Required"),
  content: z.string(),
  category: z.string().trim().min(1, "Required"),
  published_at: z.string().min(1, "Required"),
  comment_count: z.coerce.number().int().min(0),
  featured: z.boolean(),
  locked: z.boolean(),
});

type NoteForm = z.infer<typeof noteSchema>;

const emptyValues: NoteForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  category: "",
  published_at: format(new Date(), "yyyy-MM-dd"),
  comment_count: 0,
  featured: false,
  locked: false,
};

/** Full-page create/edit form, shared by /admin/notes/new and /admin/notes/$id. */
export function NoteEditorForm({ note }: { note?: Note }) {
  const navigate = useNavigate();
  const { data: notes } = useNotes();
  const createNote = useCreateNote();
  const updateNote = useUpdateNote();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(note?.image_url ?? null);

  const form = useForm<NoteForm>({
    resolver: zodResolver(noteSchema),
    defaultValues: note
      ? {
          title: note.title,
          slug: note.slug,
          excerpt: note.excerpt,
          content: note.content,
          category: note.category,
          published_at: note.published_at,
          comment_count: note.comment_count,
          featured: note.featured,
          locked: note.locked,
        }
      : emptyValues,
  });

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const onSubmit = async (values: NoteForm) => {
    try {
      let image_url = note?.image_url ?? null;
      if (imageFile) {
        image_url = await uploadMedia(imageFile, "notes", values.slug);
      }

      if (note) {
        await updateNote.mutateAsync({
          id: note.id,
          ...values,
          sort_order: note.sort_order,
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
      toast.success(note ? "Note updated." : "Note created.");
      navigate({ to: "/admin/notes" });
    } catch {
      toast.error("Something went wrong — please try again.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">{note ? "Edit note" : "New note"}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Shown on the homepage preview and the /notes page.
            </p>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" asChild>
              <a href="/admin/notes">Cancel</a>
            </Button>
            <Button type="submit" disabled={createNote.isPending || updateNote.isPending}>
              {note ? "Save changes" : "Create note"}
            </Button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
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
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      value={field.value}
                      onChange={field.onChange}
                      folder="notes"
                      placeholder="Write the full note..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <aside className="space-y-6">
            <div className="space-y-4 rounded-xl border border-border panel-card p-5">
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
              <div className="flex items-center justify-between">
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
                      <FormLabel className="!mt-0">Locked</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label>Cover image</Label>
                <img
                  src={imagePreview ?? dummyImage(note?.slug || "new-note")}
                  alt=""
                  className="h-32 w-full rounded-lg object-cover"
                />
                <Input type="file" accept="image/*" onChange={onFileChange} />
              </div>
            </div>
          </aside>
        </div>
      </form>
    </Form>
  );
}
