import { fetchApi } from "@/lib/api";
import { ApiCategory, ApiBrand } from "@/types/api";
import { ProductsClient } from "@/components/product/ProductsClient";

export default async function ProductsPage() {
  let categories: ApiCategory[] = [];
  let brands: ApiBrand[] = [];

  try {
    const [categoriesData, brandsData] = await Promise.all([
      fetchApi<ApiCategory[]>("/api/site/categories", { next: { revalidate: 3600 } }).catch(() => []),
      fetchApi<ApiBrand[]>("/api/site/brands", { next: { revalidate: 3600 } }).catch(() => []),
    ]);

    categories = categoriesData;
    brands = brandsData;
  } catch (error) {
    console.error("Failed to fetch filters data:", error);
  }

  return (
    <ProductsClient initialCategories={categories} initialBrands={brands} />
  );
}
