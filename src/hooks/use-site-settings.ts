import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export type SiteSettings = {
  id: number;
  hero_image_url: string | null;
  case_studies_iframe_url: string | null;
  updated_at: string;
};

const SITE_SETTINGS_KEY = ["site-settings"] as const;

export function useSiteSettings() {
  return useQuery({
    queryKey: SITE_SETTINGS_KEY,
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).single();
      if (error) throw error;
      return data as SiteSettings;
    },
    staleTime: 60_000,
  });
}

export function useUpdateSiteSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (
      input: Partial<Pick<SiteSettings, "hero_image_url" | "case_studies_iframe_url">>,
    ) => {
      const { data, error } = await supabase
        .from("site_settings")
        .update(input)
        .eq("id", 1)
        .select()
        .single();
      if (error) throw error;
      return data as SiteSettings;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SITE_SETTINGS_KEY });
    },
  });
}
