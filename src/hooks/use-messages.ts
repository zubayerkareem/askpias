import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export type Message = {
  id: string;
  question: string;
  phone: string;
  email: string;
  is_read: boolean;
  created_at: string;
};

export type MessageInput = {
  question: string;
  phone: string;
  email: string;
};

const MESSAGES_KEY = ["messages"] as const;

/** Public — used by the "Ask me anything" form. No auth required (RLS allows anon insert). */
export function useSubmitMessage() {
  return useMutation({
    mutationFn: async (input: MessageInput) => {
      const { error } = await supabase.from("messages").insert(input);
      if (error) throw error;
    },
  });
}

/** Admin-only — RLS blocks this for anonymous visitors. */
export function useMessages() {
  return useQuery({
    queryKey: MESSAGES_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Message[];
    },
    staleTime: 30_000,
  });
}

export function useMarkMessageRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, isRead }: { id: string; isRead: boolean }) => {
      const { error } = await supabase.from("messages").update({ is_read: isRead }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MESSAGES_KEY });
    },
  });
}
