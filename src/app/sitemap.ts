import { MetadataRoute } from "next";
export const dynamic = "force-static";
import { fetchApi } from "@/lib/api";
import { ApiProduct, ApiCategory } from "@/types/api";
import { SITE_URL } from "@/lib/constants";

/**
 * Sitemap generator.
 *
 * Fetches products and categories from the API.
 * If either request fails, the sitemap still returns the static routes
 * so a temporary API outage doesn't break search engine indexing.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL;

  // Static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/products`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/support`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];

  const [productsResult, categoriesResult] = await Promise.allSettled([
    // Fetch up to 1000 products for the sitemap — acceptable for a catalog site.
    // Consider pagination if the catalog grows beyond this.
    fetchApi<ApiProduct[] | { data: ApiProduct[] }>("/api/site/products?per_page=1000"),
    fetchApi<ApiCategory[] | { data: ApiCategory[] }>("/api/site/categories"),
  ]);

  const productEntries: MetadataRoute.Sitemap =
    productsResult.status === "fulfilled"
      ? (() => {
          const raw = productsResult.value;
          const products: ApiProduct[] = Array.isArray(raw) ? raw : raw?.data ?? [];
          return products.map((p) => ({
            url: `${baseUrl}/products/${p.id}`,
            lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.7,
          }));
        })()
      : [];

  const categoryEntries: MetadataRoute.Sitemap =
    categoriesResult.status === "fulfilled"
      ? (() => {
          const raw = categoriesResult.value;
          const categories: ApiCategory[] = Array.isArray(raw) ? raw : raw?.data ?? [];
          return categories.map((c) => ({
            url: `${baseUrl}/products?category_slug=${c.slug}`,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.6,
          }));
        })()
      : [];

  if (productsResult.status === "rejected") {
    console.error("[Sitemap] Failed to fetch products:", productsResult.reason);
  }
  if (categoriesResult.status === "rejected") {
    console.error("[Sitemap] Failed to fetch categories:", categoriesResult.reason);
  }

  return [...staticRoutes, ...productEntries, ...categoryEntries];
}
