import { queryOptions, useQuery } from "@tanstack/react-query";
import { api, type Collection } from "@/lib/api";

export type Testimonial = {
  id: number;
  headline: string;
  quote: string;
  name: string;
  role: string | null;
  company: string | null;
  initials: string | null;
  rating: number;
  sort_order: number;
};

const TESTIMONIALS_KEY = ["testimonials"] as const;

/**
 * Reviews are managed in the Filament admin (Content → Testimonials). Only
 * published rows come back, and there is no bundled fallback — the site shows
 * real reviews or nothing.
 */
export const testimonialsQueryOptions = queryOptions({
  queryKey: TESTIMONIALS_KEY,
  queryFn: async () => {
    try {
      const response = await api.get<Collection<Testimonial>>("/testimonials");
      return response.data;
    } catch {
      return [];
    }
  },
  staleTime: 60_000,
});

export function useTestimonials() {
  return useQuery(testimonialsQueryOptions);
}
