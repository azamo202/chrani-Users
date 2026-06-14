/**
 * Global constants for the application.
 * Update SITE_URL when deploying to your actual domain.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://chranico.com";
const isServer = typeof window === "undefined";
export const API_BASE_URL = isServer ? "https://api.chranico.com" : "";

export const COMPANY_DETAILS = {
  name: "Chrani Company",
  logo: "/chrani-logo.png",
  facebook: "https://facebook.com/chranicompany",
  instagram: "https://instagram.com/chranicompany",
};
