// Server-only client for the EPS (Easy Payment System) merchant gateway —
// see the "EPS Merchant API Integration Guide" (v0.5). Never import this
// from client components: it reads server-only secrets and is only safe
// inside createServerFn handlers (see src/server/eps-payment.ts).

const DEFAULT_API_BASE_URL = "https://pgapi.eps.com.bd/v1";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

/**
 * EPS hash mechanism (guide p.2): UTF8-encode the merchant hash key, use it
 * as an HMAC-SHA512 key, sign the given data value, and base64-encode the
 * digest. Implemented with Web Crypto so it works the same on any server
 * runtime (Node, Vercel, Workers) — no Node-only `crypto` module needed.
 */
async function computeHash(dataValue: string): Promise<string> {
  const hashKey = requireEnv("EPS_HASH_KEY");
  const encoder = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(hashKey),
    { name: "HMAC", hash: "SHA-512" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(dataValue));
  return btoa(String.fromCharCode(...new Uint8Array(signature)));
}

function apiBaseUrl(): string {
  return process.env["EPS_API_BASE_URL"] || DEFAULT_API_BASE_URL;
}

type GetTokenResponse = {
  token: string | null;
  expireDate: string | null;
  errorMessage: string | null;
  errorCode: string | null;
};

async function getToken(): Promise<string> {
  const userName = requireEnv("EPS_USERNAME");
  const password = requireEnv("EPS_PASSWORD");

  const response = await fetch(`${apiBaseUrl()}/Auth/GetToken`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-hash": await computeHash(userName),
    },
    body: JSON.stringify({ userName, password }),
  });

  const result = (await response.json()) as GetTokenResponse;
  if (!response.ok || !result.token) {
    throw new Error(result.errorMessage || "EPS GetToken failed");
  }
  return result.token;
}

export type InitializePaymentInput = {
  merchantTransactionId: string;
  customerOrderId: string;
  totalAmount: number;
  successUrl: string;
  failUrl: string;
  cancelUrl: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  productName: string;
};

type InitializePaymentResponse = {
  TransactionId: string | null;
  RedirectURL: string | null;
  ErrorMessage: string | null;
  ErrorCode: string | null;
};

export async function initializeEpsPayment(
  input: InitializePaymentInput,
): Promise<{ redirectUrl: string; transactionId: string }> {
  const token = await getToken();
  const storeId = requireEnv("EPS_STORE_ID");

  const response = await fetch(`${apiBaseUrl()}/EPSEngine/InitializeEPS`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-hash": await computeHash(input.merchantTransactionId),
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      storeId,
      CustomerOrderId: input.customerOrderId,
      merchantTransactionId: input.merchantTransactionId,
      transactionTypeId: 1, // Web
      totalAmount: input.totalAmount,
      successUrl: input.successUrl,
      failUrl: input.failUrl,
      cancelUrl: input.cancelUrl,
      customerName: input.customerName,
      customerEmail: input.customerEmail,
      customerAddress: "N/A",
      customerCity: "N/A",
      customerState: "N/A",
      customerPostcode: "N/A",
      customerCountry: "BD",
      customerPhone: input.customerPhone,
      productName: input.productName,
    }),
  });

  const result = (await response.json()) as InitializePaymentResponse;
  if (!response.ok || !result.RedirectURL) {
    throw new Error(result.ErrorMessage || "EPS InitializeEPS failed");
  }
  return { redirectUrl: result.RedirectURL, transactionId: result.TransactionId ?? "" };
}

export type EpsTransactionStatus = {
  epsTransactionId: string | null;
  status: string | null; // e.g. "Success", "Failed"
  financialEntity: string | null;
  errorMessage: string | null;
};

export async function verifyEpsTransaction(
  merchantTransactionId: string,
): Promise<EpsTransactionStatus> {
  const token = await getToken();
  const url = new URL(`${apiBaseUrl()}/EPSEngine/CheckMerchantTransactionStatus`);
  url.searchParams.set("merchantTransactionId", merchantTransactionId);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "x-hash": await computeHash(merchantTransactionId),
      Authorization: `Bearer ${token}`,
    },
  });

  const result = (await response.json()) as {
    EpsTransactionId?: string;
    Status?: string;
    FinancialEntity?: string;
    ErrorMessage?: string;
  };

  if (!response.ok) {
    throw new Error(result.ErrorMessage || "EPS CheckMerchantTransactionStatus failed");
  }

  return {
    epsTransactionId: result.EpsTransactionId ?? null,
    status: result.Status ?? null,
    financialEntity: result.FinancialEntity ?? null,
    errorMessage: result.ErrorMessage ?? null,
  };
}
