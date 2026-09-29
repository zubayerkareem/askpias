import { useMutation, useQuery } from "@tanstack/react-query";
import {
  initiateLeadMagnetPayment,
  verifyLeadMagnetPayment,
  type LeadMagnetPaymentResult,
} from "@/lib/eps-payment.functions";

export type InitiateLeadMagnetPaymentInput = {
  noteId: string;
  name: string;
  phone: string;
  email: string;
};

/** Public — starts an EPS checkout and returns the hosted-page redirect URL. */
export function useInitiateLeadMagnetPayment() {
  return useMutation({
    mutationFn: async (input: InitiateLeadMagnetPaymentInput) => {
      return initiateLeadMagnetPayment({ data: input });
    },
  });
}

/** Public — polls the server-verified status of a payment return. */
export function useVerifyLeadMagnetPayment(merchantTransactionId: string | null) {
  return useQuery<LeadMagnetPaymentResult>({
    queryKey: ["lead-magnet-payment-verify", merchantTransactionId],
    queryFn: async () =>
      verifyLeadMagnetPayment({ data: { merchantTransactionId: merchantTransactionId! } }),
    enabled: !!merchantTransactionId,
    retry: false,
    staleTime: Infinity,
  });
}
