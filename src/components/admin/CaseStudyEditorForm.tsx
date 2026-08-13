import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
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
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import {
  useCaseStudies,
  useCreateCaseStudy,
  useUpdateCaseStudy,
  type CaseStudy,
} from "@/hooks/use-case-studies";
import { dummyImage } from "@/lib/notes-data";
import { uploadMedia } from "@/lib/storage";

const caseStudySchema = z.object({
  name: z.string().trim().min(1, "Required"),
  slug: z
    .string()
    .trim()
    .min(1, "Required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Lowercase letters, numbers and hyphens only"),
  summary: z.string().trim().min(1, "Required"),
  content: z.string(),
  tags: z.string().trim().min(1, "Add at least one tag, comma-separated"),
});

type CaseStudyForm = z.infer<typeof caseStudySchema>;

const emptyValues: CaseStudyForm = { name: "", slug: "", summary: "", content: "", tags: "" };

/** Full-page create/edit form, shared by /admin/case-studies/new and /admin/case-studies/$id. */
export function CaseStudyEditorForm({ caseStudy }: { caseStudy?: CaseStudy }) {
  const navigate = useNavigate();
  const { data: cases } = useCaseStudies();
  const createCaseStudy = useCreateCaseStudy();
  const updateCaseStudy = useUpdateCaseStudy();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(caseStudy?.image_url ?? null);

  const form = useForm<CaseStudyForm>({
    resolver: zodResolver(caseStudySchema),
    defaultValues: caseStudy
      ? {
          name: caseStudy.name,
          slug: caseStudy.slug,
          summary: caseStudy.summary,
          content: caseStudy.content,
          tags: caseStudy.tags.join(", "),
        }
      : emptyValues,
  });

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const onSubmit = async (values: CaseStudyForm) => {
    const tags = values.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      let image_url = caseStudy?.image_url ?? null;
      if (imageFile) {
        image_url = await uploadMedia(imageFile, "case-studies", values.slug);
      }

      if (caseStudy) {
        await updateCaseStudy.mutateAsync({
          id: caseStudy.id,
          name: values.name,
          slug: values.slug,
          summary: values.summary,
          content: values.content,
          tags,
          sort_order: caseStudy.sort_order,
          image_url,
        });
      } else {
        const nextSortOrder = (cases?.at(-1)?.sort_order ?? 0) + 10;
        await createCaseStudy.mutateAsync({
          name: values.name,
          slug: values.slug,
          summary: values.summary,
          content: values.content,
          tags,
          sort_order: nextSortOrder,
          image_url,
        });
      }
      toast.success(caseStudy ? "Case study updated." : "Case study created.");
      navigate({ to: "/admin/case-studies" });
    } catch {
      toast.error("Something went wrong — please try again.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">
              {caseStudy ? "Edit case study" : "New case study"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">Shown on the /case-studies page.</p>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" asChild>
              <a href="/admin/case-studies">Cancel</a>
            </Button>
            <Button type="submit" disabled={createCaseStudy.isPending || updateCaseStudy.isPending}>
              {caseStudy ? "Save changes" : "Create case study"}
            </Button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
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
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      value={field.value}
                      onChange={field.onChange}
                      folder="case-studies"
                      placeholder="Write the full case study..."
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
                <Label>Cover image</Label>
                <img
                  src={imagePreview ?? dummyImage(caseStudy?.slug || "new-case-study")}
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
