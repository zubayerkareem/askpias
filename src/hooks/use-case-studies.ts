import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export type CaseStudy = {
  id: string;
  slug: string;
  name: string;
  summary: string;
  content: string; // Tiptap HTML output; "" when not yet written
  tags: string[];
  image_url: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type CaseStudyInput = Pick<
  CaseStudy,
  "slug" | "name" | "summary" | "content" | "tags" | "sort_order"
> & {
  image_url?: string | null;
};

const CASE_STUDIES_KEY = ["case-studies"] as const;

export function useCaseStudies() {
  return useQuery({
    queryKey: CASE_STUDIES_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("case_studies")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as CaseStudy[];
    },
    staleTime: 60_000,
  });
}

export const caseStudyByIdQueryOptions = (id: string) =>
  queryOptions({
    queryKey: [...CASE_STUDIES_KEY, id],
    queryFn: async () => {
      const { data, error } = await supabase.from("case_studies").select("*").eq("id", id).single();
      if (error) throw error;
      return data as CaseStudy;
    },
  });

export function useCaseStudy(id: string | undefined) {
  return useQuery({ ...caseStudyByIdQueryOptions(id ?? ""), enabled: !!id });
}

export const caseStudyBySlugQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: [...CASE_STUDIES_KEY, "slug", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("case_studies")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data as CaseStudy | null;
    },
  });

export function useCaseStudyBySlug(slug: string) {
  return useQuery(caseStudyBySlugQueryOptions(slug));
}

export function useCreateCaseStudy() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CaseStudyInput) => {
      const { data, error } = await supabase.from("case_studies").insert(input).select().single();
      if (error) throw error;
      return data as CaseStudy;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CASE_STUDIES_KEY });
    },
  });
}

export function useUpdateCaseStudy() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: CaseStudyInput & { id: string }) => {
      const { data, error } = await supabase
        .from("case_studies")
        .update(input)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as CaseStudy;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CASE_STUDIES_KEY });
    },
  });
}

export function useDeleteCaseStudy() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("case_studies").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CASE_STUDIES_KEY });
    },
  });
}
