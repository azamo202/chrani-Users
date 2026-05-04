import { fetchApi } from "@/lib/api";
import { ApiProduct } from "@/types/api";
import { ProductDetailClient } from "@/components/product/ProductDetailClient";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetail({ params }: PageProps) {
  const { id } = await params;
  
  let product: ApiProduct | null = null;
  let related: ApiProduct[] = [];

  try {
    product = await fetchApi<ApiProduct>(`/api/site/products/${id}`, { next: { revalidate: 3600 } });
    
    // Attempt to fetch related products from the same category
    if (product && product.category?.slug) {
      try {
        const relatedResponse = await fetchApi<{ data: ApiProduct[] }>(`/api/site/products?category_slug=${product.category.slug}&per_page=4`, { next: { revalidate: 3600 } });
        // The API returns paginated data inside 'data' if it's a list, or maybe ApiResponse handles it?
        // Let's assume fetchApi returns the raw list if it's a standard response, or a paginated object.
        // Assuming fetchApi extracts `data`, which might be the array.
        // Wait, the API usually returns `{ status: true, data: { data: [...] } }` for pagination, but let's just use the top-level array if possible.
        // Let's typecast safely:
        const relatedData = relatedResponse as any;
        let productsList: ApiProduct[] = Array.isArray(relatedData) ? relatedData : (relatedData.data || []);
        
        // Filter out current product
        related = productsList.filter(p => p.id.toString() !== id).slice(0, 3);
      } catch (e) {
        console.error("Failed to fetch related products:", e);
      }
    }

  } catch (error) {
    console.error("Failed to fetch product detail:", error);
    return notFound();
  }

  if (!product) {
    return notFound();
  }

  return <ProductDetailClient product={product} related={related} />;
}
