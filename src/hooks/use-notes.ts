import { queryOptions, useQuery } from "@tanstack/react-query";
import { api, type Collection, type Item } from "@/lib/api";
import type { Note } from "@/lib/notes-data";

const NOTES_KEY = ["notes"] as const;

export function useNotes() {
  return useQuery({
    queryKey: NOTES_KEY,
    queryFn: async () => {
      const response = await api.get<Collection<Note>>("/notes");
      return response.data;
    },
    staleTime: 60_000,
  });
}

export const noteBySlugQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: [...NOTES_KEY, "slug", slug],
    queryFn: async () => {
      try {
        const response = await api.get<Item<Note>>(`/notes/${slug}`);
        return response.data;
      } catch {
        return null;
      }
    },
  });

export function useNoteBySlug(slug: string) {
  return useQuery(noteBySlugQueryOptions(slug));
}
