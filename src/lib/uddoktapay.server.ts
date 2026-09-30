// Server-only client for the UddoktaPay payment gateway —
// see https://uddoktapay.readme.io. Never import this from client
// components: it reads the server-only API key and is only safe inside
// createServerFn handlers (see src/lib/payment.functions.ts).

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

/** e.g. https://pay.your-domain.com — a trailing /api is accepted too. */
function baseUrl(): string {
  return requireEnv("UDDOKTAPAY_BASE_URL")
    .replace(/\/+$/, "")
    .replace(/\/api$/, "");
}

async function post<T>(path: string, body: unknown): Promise<{ ok: boolean; result: T }> {
  const response = await fetch(`${baseUrl()}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "RT-UDDOKTAPAY-API-KEY": requireEnv("UDDOKTAPAY_API_KEY"),
    },
    body: JSON.stringify(body),
  });
  const result = (await response.json().catch(() => ({}))) as T;
  return { ok: response.ok, result };
}

export type CreateChargeInput = {
  fullName: string;
  email: string;
  amount: number;
  metadata: Record<string, string>;
  /** UddoktaPay appends `invoice_id` as a query param (return_type GET). */
  redirectUrl: string;
  cancelUrl: string;
};

export async function createUddoktaPayCharge(input: CreateChargeInput): Promise<string> {
  const { ok, result } = await post<{ status?: boolean; message?: string; payment_url?: string }>(
    "/api/checkout-v2",
    {
      full_name: input.fullName,
      email: input.email,
      amount: String(input.amount),
      metadata: input.metadata,
      redirect_url: input.redirectUrl,
      return_type: "GET",
      cancel_url: input.cancelUrl,
    },
  );
  if (!ok || !result.status || !result.payment_url) {
    throw new Error(result.message || "UddoktaPay create charge failed");
  }
  return result.payment_url;
}

export type UddoktaPayVerification = {
  status: "COMPLETED" | "PENDING" | "ERROR";
  invoiceId: string | null;
  amount: number | null;
  metadata: Record<string, string>;
  paymentMethod: string | null;
  senderNumber: string | null;
  transactionId: string | null;
  message: string | null;
};

export async function verifyUddoktaPayPayment(invoiceId: string): Promise<UddoktaPayVerification> {
  const { ok, result } = await post<{
    status?: string | boolean;
    message?: string;
    invoice_id?: string;
    amount?: string;
    metadata?: Record<string, string> | null;
    payment_method?: string;
    sender_number?: string;
    transaction_id?: string;
  }>("/api/verify-payment", { invoice_id: invoiceId });

  const status = String(result.status ?? "").toUpperCase();
  if (!ok || (status !== "COMPLETED" && status !== "PENDING" && status !== "ERROR")) {
    throw new Error(result.message || "UddoktaPay verify payment failed");
  }

  return {
    status: status as UddoktaPayVerification["status"],
    invoiceId: result.invoice_id ?? null,
    amount: result.amount != null ? Number(result.amount) : null,
    metadata: result.metadata ?? {},
    paymentMethod: result.payment_method ?? null,
    senderNumber: result.sender_number ?? null,
    transactionId: result.transaction_id ?? null,
    message: result.message ?? null,
  };
}
