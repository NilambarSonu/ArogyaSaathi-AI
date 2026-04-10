// ─── API Client ────────────────────────────────────────────────────────────────
// Central HTTP client for all backend requests.
// Set VITE_API_URL in .env to point at the real backend.
// Falls back to localhost:3000 for local development.
//
// ──── HOW IT WORKS IN DEMO MODE ─────────────────────────────────────────────
// If VITE_USE_MOCK=true (default), every service function returns mock data
// directly from src/mock/ without hitting the network.
// Set VITE_USE_MOCK=false to activate real API calls.

import { API_BASE_URL } from "@/constants";
import type { ApiResponse } from "@/types";

export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false";

// ─── Error class ──────────────────────────────────────────────────────────────
export class ApiClientError extends Error {
  code: string;
  details?: unknown;

  constructor(code: string, message: string, details?: unknown) {
    super(message);
    this.name = "ApiClientError";
    this.code = code;
    this.details = details;
  }
}

// ─── Core request wrapper ─────────────────────────────────────────────────────
async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${path}`;

  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const errBody = (await res.json().catch(() => ({}))) as {
      message?: string;
      code?: string;
    };
    throw new ApiClientError(
      errBody.code ?? `HTTP_${res.status}`,
      errBody.message ?? `Request failed with status ${res.status}`
    );
  }

  return res.json() as Promise<ApiResponse<T>>;
}

// ─── HTTP helpers ─────────────────────────────────────────────────────────────
export const apiClient = {
  get: <T>(path: string, options?: RequestInit) =>
    request<T>(path, { method: "GET", ...options }),

  post: <T>(path: string, body: unknown, options?: RequestInit) =>
    request<T>(path, {
      method: "POST",
      body: JSON.stringify(body),
      ...options,
    }),

  put: <T>(path: string, body: unknown, options?: RequestInit) =>
    request<T>(path, {
      method: "PUT",
      body: JSON.stringify(body),
      ...options,
    }),

  patch: <T>(path: string, body: unknown, options?: RequestInit) =>
    request<T>(path, {
      method: "PATCH",
      body: JSON.stringify(body),
      ...options,
    }),

  delete: <T>(path: string, options?: RequestInit) =>
    request<T>(path, { method: "DELETE", ...options }),
};
