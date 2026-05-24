export async function getLang(): Promise<"en" | "ar" | "ku"> {
  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    return (cookieStore.get("chrani-lang")?.value || "ar") as "en" | "ar" | "ku";
  } catch (error) {
    return "ar";
  }
}
