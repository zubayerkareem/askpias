import { useQuery } from "@tanstack/react-query";
import { api, type Collection } from "@/lib/api";
import { fallbackTestimonials, type Testimonial } from "@/lib/testimonials";

const TESTIMONIALS_KEY = ["testimonials"] as const;

/**
 * Testimonials are managed in the Filament admin. The bundled list is only a
 * fallback for when the API is unreachable (e.g. Laravel not running yet).
 */
export function useTestimonials() {
  return useQuery({
    queryKey: TESTIMONIALS_KEY,
    queryFn: async () => {
      try {
        const response = await api.get<Collection<Testimonial>>("/testimonials");
        return response.data.length > 0 ? response.data : fallbackTestimonials;
      } catch {
        return fallbackTestimonials;
      }
    },
    staleTime: 60_000,
    initialData: fallbackTestimonials,
  });
}
