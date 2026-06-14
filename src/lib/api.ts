/**
 * API fetch utility — Chrani Catalog.
 *
 * Routing strategy:
 *
 *  ┌──────────────┬──────────────────────────────────────────────────────────┐
 *  │ Environment  │ Server-side requests                                     │
 *  ├──────────────┼──────────────────────────────────────────────────────────┤
 *  │ Development  │ http://localhost:3000/api/site/*                         │
 *  │              │ → routed through the Next.js rewrite proxy               │
 *  │              │ → avoids ECONNRESET / firewall issues on local machines  │
 *  ├──────────────┼──────────────────────────────────────────────────────────┤
 *  │ Production   │ https://api.chranico.com (direct — fastest path)        │
 *  └──────────────┴──────────────────────────────────────────────────────────┘
 *
 *  Client-side (browser) always uses "" (relative URL) so requests go through
 *  the /api/site/* rewrite proxy regardless of environment.
 */

export const API_BASE_URL: string = "https://api.chranico.com";

export interface StoreSettings {
  phone: string;
  whatsapp: string;
}

/** Default request timeout in milliseconds */
const DEFAULT_TIMEOUT_MS = 10_000;

/**
 * Generic fetch wrapper for the Chrani API.
 *
 * Features:
 *  - Request timeout (default 10 s) with AbortController.
 *  - Transparent envelope unwrapping: `{ status, data: T }` → T.
 *  - Rich error messages with status code + body preview.
 *  - Content-type validation to detect HTML error pages (e.g. 502).
 */
export async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit & { timeoutMs?: number }
): Promise<T> {
  const { timeoutMs = DEFAULT_TIMEOUT_MS, ...fetchOptions } = options ?? {};
  const url = `${API_BASE_URL}${endpoint}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      ...fetchOptions,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let bodyPreview = "";
      try {
        const ct = response.headers.get("content-type") ?? "";
        if (ct.includes("application/json")) {
          const errBody = await response.json();
          bodyPreview = JSON.stringify(errBody).slice(0, 200);
        } else {
          bodyPreview = (await response.text()).slice(0, 200);
        }
      } catch {
        // ignore
      }

      throw new Error(
        `API ${response.status} ${response.statusText} — ${endpoint}${
          bodyPreview ? ` | ${bodyPreview}` : ""
        }`
      );
    }

    // Guard against HTML error pages returned by a reverse proxy (e.g. 502 Nginx).
    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      throw new Error(
        `Unexpected content-type "${contentType}" from ${endpoint}. Expected JSON.`
      );
    }

    const json = await response.json();

    // Unwrap common envelope shapes:
    //   { status: true, data: T } → return T
    //   T                         → return T as-is
    if (json && typeof json === "object" && "data" in json) {
      return (json as { data: T }).data;
    }

    return json as T;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(`Request timeout after ${timeoutMs}ms — ${endpoint}`);
    }

    if (error instanceof Error) {
      throw new Error(`fetchApi(${endpoint}): ${error.message}`);
    }
    throw error;
  }
}

/** Convenience helper for store settings — used in multiple pages. */
export async function getStoreSettings(): Promise<StoreSettings> {
  return fetchApi<StoreSettings>("/api/site/store-settings");
}
