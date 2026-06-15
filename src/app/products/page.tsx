import { fetchApi } from "@/lib/api";
import { ApiCategory, ApiBrand } from "@/types/api";
import { ProductsClient } from "@/components/product/ProductsClient";
import { normalizeCategories } from "@/services/normalizers/categoryNormalizer";
import { normalizeBrands } from "@/services/normalizers/brandNormalizer";
import { CACHE_TTL } from "@/lib/constants";

/**
 * Products listing page — Server Component.
 * Fetches filter data (categories + brands) server-side for the initial render.
 * The actual product list is fetched client-side (React Query) to support
 * live filtering/pagination without full page reloads.
 */
export default async function ProductsPage() {
  const [categoriesResult, brandsResult] = await Promise.allSettled([
    fetchApi<ApiCategory[]>("/api/site/categories", {
      next: { revalidate: CACHE_TTL.categories, tags: ["categories"] },
    }),
    fetchApi<ApiBrand[]>("/api/site/brands", {
      next: { revalidate: CACHE_TTL.brands, tags: ["brands"] },
    }),
  ]);

  const categories =
    categoriesResult.status === "fulfilled" ? normalizeCategories(categoriesResult.value ?? []) : [];
  const brands =
    brandsResult.status === "fulfilled" ? normalizeBrands(brandsResult.value ?? []) : [];

  if (categoriesResult.status === "rejected") {
    console.error("[ProductsPage] Failed to fetch categories:", categoriesResult.reason);
  }
  if (brandsResult.status === "rejected") {
    console.error("[ProductsPage] Failed to fetch brands:", brandsResult.reason);
  }

  return <ProductsClient initialCategories={categories} initialBrands={brands} />;
}
