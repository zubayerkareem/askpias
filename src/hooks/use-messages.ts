import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";

export type MessageInput = {
  name?: string;
  phone: string;
  email: string;
  question: string;
};

/** Public — used by the "Ask me anything" form. */
export function useSubmitMessage() {
  return useMutation({
    mutationFn: (input: MessageInput) => api.post<{ message: string }>("/messages", input),
  });
}
