import { queryOptions, useQuery } from "@tanstack/react-query";
import { api, type Collection, type Item } from "@/lib/api";

export type Project = {
  id: number;
  slug: string;
  name: string;
  kicker: string | null;
  summary: string | null;
  description: string | null;
  icon: string;
  tags: string[];
  url: string | null;
  cta_label: string | null;
  sort_order: number;
};

const PROJECTS_KEY = ["projects"] as const;

export function useProjects() {
  return useQuery({
    queryKey: PROJECTS_KEY,
    queryFn: async () => {
      const response = await api.get<Collection<Project>>("/projects");
      return response.data;
    },
    staleTime: 60_000,
  });
}

export const projectBySlugQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: [...PROJECTS_KEY, "slug", slug],
    queryFn: async () => {
      try {
        const response = await api.get<Item<Project>>(`/projects/${slug}`);
        return response.data;
      } catch {
        return null;
      }
    },
  });

export function useProjectBySlug(slug: string) {
  return useQuery(projectBySlugQueryOptions(slug));
}
