import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export type SiteSettings = {
  hero_image_url: string | null;
  case_studies_iframe_url: string | null;
  intro_video_url: string | null;
  gtm_container_id: string | null;
  contact_email: string | null;
  tagline: string | null;
};

const SITE_SETTINGS_KEY = ["site-settings"] as const;

export function useSiteSettings() {
  return useQuery({
    queryKey: SITE_SETTINGS_KEY,
    queryFn: () => api.get<SiteSettings>("/settings"),
    staleTime: 60_000,
  });
}
