import { useMutation, useQuery } from "@tanstack/react-query";
import {
  initiateLeadMagnetPayment,
  verifyLeadMagnetPayment,
  type LeadMagnetPaymentResult,
} from "@/lib/payment.functions";

export type InitiateLeadMagnetPaymentInput = {
  noteId: string;
  name: string;
  phone: string;
  email: string;
};

/** Public — starts a UddoktaPay checkout and returns the hosted-page redirect URL. */
export function useInitiateLeadMagnetPayment() {
  return useMutation({
    mutationFn: async (input: InitiateLeadMagnetPaymentInput) => {
      return initiateLeadMagnetPayment({ data: input });
    },
  });
}

/** Public — polls the server-verified status of a payment return. */
export function useVerifyLeadMagnetPayment(invoiceId: string | null) {
  return useQuery<LeadMagnetPaymentResult>({
    queryKey: ["lead-magnet-payment-verify", invoiceId],
    queryFn: async () => verifyLeadMagnetPayment({ data: { invoiceId: invoiceId! } }),
    enabled: !!invoiceId,
    retry: false,
    staleTime: Infinity,
  });
}
