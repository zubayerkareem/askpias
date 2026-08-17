import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const DEFAULT_LEAD_MAGNET_CTA_LABEL = "Download";

export type LeadMagnetSubmission = {
  id: string;
  note_id: string;
  name: string;
  email: string;
  phone: string;
  created_at: string;
  notes: { title: string } | null; // populated by the notes(title) embed
};

export type LeadMagnetSubmissionInput = {
  note_id: string;
  name: string;
  email: string;
  phone: string;
};

const LEAD_MAGNET_SUBMISSIONS_KEY = ["lead-magnet-submissions"] as const;

/** Public — used by LeadMagnetForm. No auth required (RLS allows anon insert). */
export function useSubmitLeadMagnetLead() {
  return useMutation({
    mutationFn: async (input: LeadMagnetSubmissionInput) => {
      const { error } = await supabase.from("lead_magnet_submissions").insert(input);
      if (error) throw error;
    },
  });
}

/** Admin-only — RLS blocks this for anonymous visitors. */
export function useLeadMagnetSubmissions() {
  return useQuery({
    queryKey: LEAD_MAGNET_SUBMISSIONS_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lead_magnet_submissions")
        .select("*, notes(title)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as unknown as LeadMagnetSubmission[];
    },
    staleTime: 30_000,
  });
}
