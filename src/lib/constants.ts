/**
 * Global constants for the application.
 *
 * Rules:
 *  - NEXT_PUBLIC_* vars are exposed to the browser at build time.
 *  - Server-only constants (e.g. API secrets) should never use NEXT_PUBLIC_.
 *  - Always provide a safe fallback for non-critical vars.
 */

/** Canonical public URL of this site — used in metadata and Open Graph tags. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://chranico.com";

export const API_BASE_URL = "https://api.chranico.com";

/** Shared company details referenced in structured data and UI. */
export const COMPANY_DETAILS = {
  name: "Chrani Company",
  logo: "/chrani-logo.png",
  facebook: "https://facebook.com/chranicompany",
  instagram: "https://instagram.com/chranicompany",
} as const;

/** Cache revalidation intervals (seconds). */
export const CACHE_TTL = {
  storeSettings: 3600,  // 1 hour
  categories: 3600,     // 1 hour
  brands: 3600,         // 1 hour
  homeData: 60,         // 1 minute — editorial content updated more often
  products: 3600,       // 1 hour
  supportData: 3600,    // 1 hour
} as const;

/** Pagination defaults. */
export const PAGINATION = {
  defaultPerPage: 12,
  maxPerPage: 100,
} as const;
