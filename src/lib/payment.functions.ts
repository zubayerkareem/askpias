import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase-admin.server";
import { createUddoktaPayCharge, verifyUddoktaPayPayment } from "@/lib/uddoktapay.server";

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
  return `LM${Date.now()}${Math.floor(1000 + Math.random() * 9000)}`;
}

function siteOrigin(): string {
  const request = getRequest();
  return new URL(request.url).origin;
}

/**
 * Starts a paid-lead-magnet checkout: records the submission + a pending
 * payment row, then asks UddoktaPay to create a charge and returns the
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

    try {
      const paymentUrl = await createUddoktaPayCharge({
        fullName: data.name,
        email: data.email,
        amount: Number(note.lead_magnet_price),
        // Echoed back by verify-payment — this is how a returning invoice_id
        // is tied to our payment row, so the redirect URL needs no params
        // of its own (UddoktaPay appends ?invoice_id=... to it).
        metadata: { merchant_transaction_id: merchantTransactionId, note_id: note.id },
        redirectUrl: `${origin}/notes/download`,
        cancelUrl: `${origin}/notes/download?result=cancel&slug=${encodeURIComponent(note.slug)}`,
      });
      return { redirectUrl: paymentUrl };
    } catch (error) {
      await supabaseAdmin
        .from("lead_magnet_payments")
        .update({
          status: "failed",
          error_message: error instanceof Error ? error.message : "UddoktaPay create charge failed",
        })
        .eq("merchant_transaction_id", merchantTransactionId);
      throw new Error("Could not start payment — please try again.");
    }
  });

const verifyPaymentSchema = z.object({
  invoiceId: z.string().trim().min(1),
});

export type LeadMagnetPaymentResult = {
  status: "success" | "failed" | "cancelled" | "pending";
  slug: string | null;
  fileUrl: string | null;
  ctaLabel: string | null;
};

type PaymentNote = {
  slug: string;
  lead_magnet_file_url: string | null;
  lead_magnet_cta_label: string | null;
};

/**
 * Server-side source of truth for whether a lead-magnet payment succeeded.
 * Never trust the browser merely landing on the redirect URL — UddoktaPay's
 * verify-payment call is what actually confirms payment.
 */
export const verifyLeadMagnetPayment = createServerFn({ method: "GET" })
  .validator(verifyPaymentSchema)
  .handler(async ({ data }): Promise<LeadMagnetPaymentResult> => {
    const supabaseAdmin = getSupabaseAdmin();
    const paymentSelect =
      "id, status, amount, notes(slug, lead_magnet_file_url, lead_magnet_cta_label)";

    // Idempotent: once we've recorded success for this invoice, trust our
    // own record rather than re-hitting UddoktaPay on every page refresh.
    const { data: known } = await supabaseAdmin
      .from("lead_magnet_payments")
      .select(paymentSelect)
      .eq("invoice_id", data.invoiceId)
      .maybeSingle();
    if (known?.status === "success") {
      const note = known.notes as unknown as PaymentNote | null;
      return {
        status: "success",
        slug: note?.slug ?? null,
        fileUrl: note?.lead_magnet_file_url ?? null,
        ctaLabel: note?.lead_magnet_cta_label ?? null,
      };
    }

    const verification = await verifyUddoktaPayPayment(data.invoiceId);
    const merchantTransactionId = verification.metadata["merchant_transaction_id"];
    if (!merchantTransactionId) throw new Error("Payment not found.");

    const { data: payment, error: paymentError } = await supabaseAdmin
      .from("lead_magnet_payments")
      .select(paymentSelect)
      .eq("merchant_transaction_id", merchantTransactionId)
      .single();
    if (paymentError || !payment) throw new Error("Payment not found.");

    const note = payment.notes as unknown as PaymentNote | null;
    const paidInFull = verification.amount != null && verification.amount >= Number(payment.amount);

    const status: LeadMagnetPaymentResult["status"] =
      verification.status === "COMPLETED" && paidInFull
        ? "success"
        : verification.status === "PENDING"
          ? "pending"
          : "failed";

    await supabaseAdmin
      .from("lead_magnet_payments")
      .update({
        status,
        invoice_id: data.invoiceId,
        payment_method: verification.paymentMethod,
        sender_number: verification.senderNumber,
        gateway_transaction_id: verification.transactionId,
        error_message:
          verification.status === "COMPLETED" && !paidInFull
            ? `Amount mismatch: paid ${verification.amount}, expected ${payment.amount}`
            : verification.status === "ERROR"
              ? verification.message
              : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", payment.id);

    return {
      status,
      slug: note?.slug ?? null,
      fileUrl: status === "success" ? (note?.lead_magnet_file_url ?? null) : null,
      ctaLabel: note?.lead_magnet_cta_label ?? null,
    };
  });
