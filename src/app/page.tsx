import { fetchApi } from "@/lib/api";
import { ApiHomeSection, ApiCategory } from "@/types/api";
import { HomePageClient } from "@/components/home/HomePageClient";
import { normalizeProducts } from "@/services/normalizers/productNormalizer";
import { normalizeCategories } from "@/services/normalizers/categoryNormalizer";
import { CACHE_TTL } from "@/lib/constants";

/**
 * Home page — Server Component.
 * Data is fetched server-side and passed to the client shell.
 * Both fetches are run in parallel; individual failures are handled
 * gracefully so a broken sections API doesn't break the entire page.
 */
export default async function Home() {
  let sections: ApiHomeSection[] = [];
  let categories: ApiCategory[] = [];

  const [sectionsResult, categoriesResult] = await Promise.allSettled([
    fetchApi<ApiHomeSection[]>("/api/site/home-sections", {
      next: { revalidate: CACHE_TTL.homeData, tags: ["home-sections"] },
    }),
    fetchApi<ApiCategory[]>("/api/site/categories", {
      next: { revalidate: CACHE_TTL.categories, tags: ["categories"] },
    }),
  ]);

  if (sectionsResult.status === "fulfilled") {
    sections = (sectionsResult.value ?? []).map(section => ({
      ...section,
      products: normalizeProducts(section.products)
    }));
  } else {
    console.error("[Home] Failed to fetch home sections:", sectionsResult.reason);
  }

  if (categoriesResult.status === "fulfilled") {
    categories = normalizeCategories(categoriesResult.value ?? []);
  } else {
    console.error("[Home] Failed to fetch categories:", categoriesResult.reason);
  }

  return <HomePageClient sections={sections} categories={categories} />;
}
