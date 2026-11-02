/**
 * Tiny fetch wrapper for the Laravel API.
 *
 * The backend lives in /backend (Laravel + Filament). Set VITE_API_URL to
 * point at it; defaults to the local Laravel dev server.
 */
export const API_URL: string =
  (import.meta.env["VITE_API_URL"] as string | undefined)?.replace(/\/$/, "") ??
  "http://127.0.0.1:8000/api";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | undefined;
  body?: unknown;
  signal?: AbortSignal | undefined;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const init: RequestInit = {
    method: options.method ?? "GET",
    headers: options.body
      ? { Accept: "application/json", "Content-Type": "application/json" }
      : { Accept: "application/json" },
  };

  if (options.body !== undefined) {
    init.body = JSON.stringify(options.body);
  }

  if (options.signal) {
    init.signal = options.signal;
  }

  const response = await fetch(`${API_URL}${path}`, init);

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const body = (await response.json()) as { message?: string };
      if (body?.message) message = body.message;
    } catch {
      /* keep the fallback message */
    }
    throw new ApiError(response.status, message);
  }

  if (response.status === 204) return undefined as T;

  return (await response.json()) as T;
}

export const api = {
  get: <T>(path: string, signal?: AbortSignal) => request<T>(path, { signal }),
  post: <T>(path: string, body: unknown) => request<T>(path, { method: "POST", body }),
};

/** Laravel wraps collections in { data: [...] }. */
export type Collection<T> = { data: T[] };
/** ...and single resources in { data: {...} }. */
export type Item<T> = { data: T };
