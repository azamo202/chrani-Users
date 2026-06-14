/**
 * Language detection utility — server-side only.
 *
 * Reads the "chrani-lang" cookie set by the client-side I18nProvider.
 * Falls back to Arabic ("ar") — the primary market language.
 *
 * Import only in Server Components / Route Handlers; never in Client Components.
 */

const VALID_LANGS = ["en", "ar", "ku"] as const;
type Lang = (typeof VALID_LANGS)[number];

export async function getLang(): Promise<Lang> {
  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const lang = cookieStore.get("chrani-lang")?.value;

    // Validate the cookie value is one of the supported languages.
    if (lang && (VALID_LANGS as readonly string[]).includes(lang)) {
      return lang as Lang;
    }

    return "ar"; // Default
  } catch {
    return "ar";
  }
}
