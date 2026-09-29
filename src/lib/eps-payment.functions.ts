import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase-admin.server";
import { initializeEpsPayment, verifyEpsTransaction } from "@/lib/eps.server";

const initiatePaymentSchema = z.object({
  noteId: z.string().uuid(),
  name: z.string().trim().min(1),
  phone: z
    .string()
    .trim()
    .regex(/^(?:\+?880|0)1[3-9]\d{8}$/),
  email: z.string().trim().email(),
});

function generateMerchantTransactionId(): string {
  // Guide requires a unique, minimum-10-digit string per transaction.
  return `LM${Date.now()}${Math.floor(1000 + Math.random() * 9000)}`;
}

function siteOrigin(): string {
  const request = getRequest();
  return new URL(request.url).origin;
}

/**
 * Starts a paid-lead-magnet checkout: records the submission + a pending
 * payment row, then asks EPS to initialize a transaction and returns the
 * hosted-page URL to redirect the visitor's browser to.
 */
export const initiateLeadMagnetPayment = createServerFn({ method: "POST" })
  .validator(initiatePaymentSchema)
  .handler(async ({ data }) => {
    const supabaseAdmin = getSupabaseAdmin();

    const { data: note, error: noteError } = await supabaseAdmin
      .from("notes")
      .select("id, slug, title, lead_magnet_payment_required, lead_magnet_price")
      .eq("id", data.noteId)
      .single();
    if (noteError || !note) throw new Error("Note not found.");
    if (!note.lead_magnet_payment_required || !note.lead_magnet_price) {
      throw new Error("This lead magnet does not require payment.");
    }

    const { data: submission, error: submissionError } = await supabaseAdmin
      .from("lead_magnet_submissions")
      .insert({ note_id: note.id, name: data.name, phone: data.phone, email: data.email })
      .select("id")
      .single();
    if (submissionError || !submission) throw new Error("Could not save your details.");

    const merchantTransactionId = generateMerchantTransactionId();

    const { error: paymentError } = await supabaseAdmin.from("lead_magnet_payments").insert({
      submission_id: submission.id,
      note_id: note.id,
      merchant_transaction_id: merchantTransactionId,
      amount: note.lead_magnet_price,
      status: "pending",
    });
    if (paymentError) throw new Error("Could not start payment.");

    const origin = siteOrigin();
    const returnBase = `${origin}/notes/download?slug=${encodeURIComponent(note.slug)}&mtid=${encodeURIComponent(merchantTransactionId)}`;

    try {
      const { redirectUrl } = await initializeEpsPayment({
        merchantTransactionId,
        customerOrderId: merchantTransactionId,
        totalAmount: note.lead_magnet_price,
        successUrl: returnBase,
        failUrl: `${returnBase}&result=fail`,
        cancelUrl: `${returnBase}&result=cancel`,
        customerName: data.name,
        customerEmail: data.email,
        customerPhone: data.phone,
        productName: note.title,
      });
      return { redirectUrl };
    } catch (error) {
      await supabaseAdmin
        .from("lead_magnet_payments")
        .update({
          status: "failed",
          error_message: error instanceof Error ? error.message : "EPS initialize failed",
        })
        .eq("merchant_transaction_id", merchantTransactionId);
      throw new Error("Could not start payment — please try again.");
    }
  });

const verifyPaymentSchema = z.object({
  merchantTransactionId: z.string().trim().min(1),
});

export type LeadMagnetPaymentResult = {
  status: "success" | "failed" | "cancelled" | "pending";
  fileUrl: string | null;
  ctaLabel: string | null;
};

/**
 * Server-side source of truth for whether a lead-magnet payment succeeded.
 * Never trust the browser merely landing on the success return URL — EPS's
 * CheckMerchantTransactionStatus call is what actually confirms payment.
 */
export const verifyLeadMagnetPayment = createServerFn({ method: "GET" })
  .validator(verifyPaymentSchema)
  .handler(async ({ data }): Promise<LeadMagnetPaymentResult> => {
    const supabaseAdmin = getSupabaseAdmin();

    const { data: payment, error: paymentError } = await supabaseAdmin
      .from("lead_magnet_payments")
      .select("id, status, note_id, notes(lead_magnet_file_url, lead_magnet_cta_label)")
      .eq("merchant_transaction_id", data.merchantTransactionId)
      .single();
    if (paymentError || !payment) throw new Error("Payment not found.");

    const note = payment.notes as unknown as {
      lead_magnet_file_url: string | null;
      lead_magnet_cta_label: string | null;
    } | null;

    // Idempotent: once we've recorded success, trust our own record rather
    // than re-hitting EPS on every page refresh.
    if (payment.status === "success") {
      return {
        status: "success",
        fileUrl: note?.lead_magnet_file_url ?? null,
        ctaLabel: note?.lead_magnet_cta_label ?? null,
      };
    }

    const verification = await verifyEpsTransaction(data.merchantTransactionId);
    const status =
      verification.status?.toLowerCase() === "success" ? ("success" as const) : ("failed" as const);

    await supabaseAdmin
      .from("lead_magnet_payments")
      .update({
        status,
        eps_transaction_id: verification.epsTransactionId,
        financial_entity: verification.financialEntity,
        error_message: verification.errorMessage,
        updated_at: new Date().toISOString(),
      })
      .eq("id", payment.id);

    return {
      status,
      fileUrl: status === "success" ? (note?.lead_magnet_file_url ?? null) : null,
      ctaLabel: note?.lead_magnet_cta_label ?? null,
    };
  });
