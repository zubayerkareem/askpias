import { queryOptions, useQuery } from "@tanstack/react-query";
import { api, type Collection, type Item } from "@/lib/api";

export type CaseStudy = {
  id: number;
  slug: string;
  name: string;
  summary: string;
  content: string;
  tags: string[];
  image_url: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

const CASE_STUDIES_KEY = ["case-studies"] as const;

export function useCaseStudies() {
  return useQuery({
    queryKey: CASE_STUDIES_KEY,
    queryFn: async () => {
      const response = await api.get<Collection<CaseStudy>>("/case-studies");
      return response.data;
    },
    staleTime: 60_000,
  });
}

export const caseStudyBySlugQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: [...CASE_STUDIES_KEY, "slug", slug],
    queryFn: async () => {
      try {
        const response = await api.get<Item<CaseStudy>>(`/case-studies/${slug}`);
        return response.data;
      } catch {
        return null;
      }
    },
  });

export function useCaseStudyBySlug(slug: string) {
  return useQuery(caseStudyBySlugQueryOptions(slug));
}
