import { queryOptions, useQuery } from "@tanstack/react-query";
import { api, type Collection, type Item } from "@/lib/api";

export type Book = {
  id: number;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  badge: string | null;
  cover_image_url: string | null;
  featured_image_url: string | null;
  price: number | null;
  currency: string;
  features: string[];
  buy_url: string | null;
  sample_url: string | null;
  is_featured: boolean;
  sort_order: number;
};

const BOOKS_KEY = ["books"] as const;

export function useBooks() {
  return useQuery({
    queryKey: BOOKS_KEY,
    queryFn: async () => {
      const response = await api.get<Collection<Book>>("/books");
      return response.data;
    },
    staleTime: 60_000,
  });
}

export const bookBySlugQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: [...BOOKS_KEY, "slug", slug],
    queryFn: async () => {
      try {
        const response = await api.get<Item<Book>>(`/books/${slug}`);
        return response.data;
      } catch {
        return null;
      }
    },
  });

export function useBookBySlug(slug: string) {
  return useQuery(bookBySlugQueryOptions(slug));
}
