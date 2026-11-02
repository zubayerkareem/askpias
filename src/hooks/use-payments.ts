import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export type CheckoutInput = {
  name: string;
  phone: string;
  email: string;
  slug: string;
};

export type PaymentVerification = {
  status: "paid" | "pending" | "failed" | "free" | "error";
  note_slug: string | null;
  note_title: string | null;
  download_url: string | null;
  amount: number | null;
  currency: string | null;
  message?: string;
};

/** Creates a UddoktaPay charge and returns the hosted payment URL. */
export function useCheckoutLead() {
  return useMutation({
    mutationFn: (input: CheckoutInput) =>
      api.post<{ payment_url: string; lead_id: number }>("/leads/checkout", input),
  });
}

/** Verifies an invoice id returned by UddoktaPay. */
export function useVerifyPayment(invoiceId: string | null) {
  return useQuery({
    queryKey: ["payment-verification", invoiceId],
    queryFn: () =>
      api.get<PaymentVerification>(
        `/payments/verify?invoice_id=${encodeURIComponent(invoiceId ?? "")}`,
      ),
    enabled: !!invoiceId,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}
