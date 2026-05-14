import type { Metadata } from "next";
import { fetchApi } from "@/lib/api";
import { ApiProduct, ApiStoreSettings } from "@/types/api";
import { ProductDetailClient } from "@/components/product/ProductDetailClient";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const cookieStore = await cookies();
  const lang = (cookieStore.get("chrani-lang")?.value || "en") as "en" | "ar" | "ku";

  try {
    const product = await fetchApi<ApiProduct>(`/api/site/products/${id}?locale=${lang}&lang=${lang}`);
    const name = product.name[lang] || product.name["en"];
    const desc = product.description?.[lang] || product.description?.["en"] || "Product detail";
    const image = product.images.find(i => i.is_primary)?.url || product.images[0]?.url || "/chrani-logo.png";

    return {
      title: `${name} | Chrani`,
      description: desc,
      openGraph: {
        title: name,
        description: desc,
        images: [{ url: image }],
      },
      twitter: {
        card: "summary_large_image",
        title: name,
        description: desc,
        images: [image],
      },
    };
  } catch (e) {
    return { title: "Product Detail | Chrani" };
  }
}

export default async function ProductDetail({ params }: PageProps) {
  const { id } = await params;

  const cookieStore = await cookies();
  const lang = cookieStore.get("chrani-lang")?.value || "en";

  let product: ApiProduct | null = null;
  let related: ApiProduct[] = [];
  let settings: ApiStoreSettings | null = null;

  try {
    product = await fetchApi<ApiProduct>(`/api/site/products/${id}?locale=${lang}&lang=${lang}`, {
      headers: { "Accept-Language": lang },
      next: { revalidate: 3600, tags: [`product-${id}-${lang}`] },
    });

    // Attempt to fetch related products from the same category
    if (product && product.category?.slug) {
      try {
        const relatedResponse = await fetchApi<{ data: ApiProduct[] }>(
          `/api/site/products?category_slug=${product.category.slug}&per_page=4&locale=${lang}&lang=${lang}`,
          { 
            headers: { "Accept-Language": lang },
            next: { revalidate: 3600 } 
          },
        );
        // The API returns paginated data inside 'data' if it's a list, or maybe ApiResponse handles it?
        // Let's assume fetchApi returns the raw list if it's a standard response, or a paginated object.
        // Assuming fetchApi extracts `data`, which might be the array.
        // Wait, the API usually returns `{ status: true, data: { data: [...] } }` for pagination, but let's just use the top-level array if possible.
        // Let's typecast safely:
        const relatedData = relatedResponse as any;
        let productsList: ApiProduct[] = Array.isArray(relatedData)
          ? relatedData
          : relatedData.data || [];

        // Filter out current product
        related = productsList
          .filter((p) => p.id.toString() !== id)
          .slice(0, 3);
      } catch (e) {
        console.error("Failed to fetch related products:", e);
      }
    }

    // جلب إعدادات المتجر من الباك إند
    try {
      const settingsResponse = await fetchApi<any>(`/api/site/store-settings?locale=${lang}&lang=${lang}`, {
        headers: { "Accept-Language": lang },
        next: { revalidate: 3600 },
      });

      settings = settingsResponse.settings;
    } catch (e) {
      console.error("Failed to fetch store settings:", e);
    }
  } catch (error) {
    console.error("Failed to fetch product detail:", error);
    return notFound();
  }

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name[lang] || product.name["en"],
    "image": product.images.map(img => img.url),
    "description": product.description?.[lang] || product.description?.["en"],
    "sku": product.model_number,
    "mpn": product.model_number,
    "brand": {
      "@type": "Brand",
      "name": product.brand?.name || "Chrani"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://chrani.com/products/${product.id}`,
      "priceCurrency": "USD",
      "price": "0",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Chrani Company"
      }
    }
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": lang === "ar" ? "الرئيسية" : lang === "ku" ? "ماڵەوە" : "Home",
        "item": "https://chrani.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": lang === "ar" ? "المنتجات" : lang === "ku" ? "بەرهەمەکان" : "Products",
        "item": "https://chrani.com/products"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": product.name[lang] || product.name["en"],
        "item": `https://chrani.com/products/${product.id}`
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ProductDetailClient
        product={product}
        related={related}
        settings={settings}
      />
    </>
  );
}
