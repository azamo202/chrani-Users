import type { Metadata } from "next";
import { fetchApi } from "@/lib/api";
import { ApiProduct, ApiStoreSettings } from "@/types/api";
import { ProductDetailClient } from "@/components/product/ProductDetailClient";
import { normalizeProduct, normalizeProducts } from "@/services/normalizers/productNormalizer";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { SITE_URL, CACHE_TTL } from "@/lib/constants";

interface PageProps {
  params: Promise<{ id: string }>;
}

/** Validate that the ID is a safe integer string — prevents path traversal and SQL-injection-style attacks */
function isValidProductId(id: string): boolean {
  return /^\d{1,10}$/.test(id);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;

  if (!isValidProductId(id)) {
    return { title: "Product Not Found | Chrani" };
  }

  const cookieStore = await cookies();
  const lang = (cookieStore.get("chrani-lang")?.value || "en") as "en" | "ar" | "ku";

  try {
    const product = await fetchApi<ApiProduct>(
      `/api/site/products/${id}?locale=${lang}&lang=${lang}`,
      {
        next: {
          revalidate: CACHE_TTL.products,
          tags: [`product-${id}`, "products"],
        },
      }
    ).then(normalizeProduct);

    const name = product.name[lang] ?? product.name.en ?? "Product";
    const desc =
      product.description?.[lang] ??
      product.description?.en ??
      "Product detail";
    const image =
      product.images.find((i) => i.is_primary)?.url ??
      product.images[0]?.url ??
      `${SITE_URL}/chrani-logo.png`;

    return {
      title: `${name} | Chrani`,
      description: desc,
      openGraph: {
        title: name,
        description: desc,
        images: [{ url: image, width: 800, height: 800, alt: name }],
      },
      twitter: {
        card: "summary_large_image",
        title: name,
        description: desc,
        images: [image],
      },
    };
  } catch {
    return { title: "Product Detail | Chrani" };
  }
}

export default async function ProductDetail({ params }: PageProps) {
  const { id } = await params;

  // Guard against malformed / injection IDs before making any API calls.
  if (!isValidProductId(id)) {
    notFound();
  }

  const cookieStore = await cookies();
  const lang = (cookieStore.get("chrani-lang")?.value ?? "en") as
    | "en"
    | "ar"
    | "ku";

  // Fetch product first (required — 404 if missing).
  let product: ApiProduct;
  try {
    product = await fetchApi<ApiProduct>(
      `/api/site/products/${id}?locale=${lang}&lang=${lang}`,
      {
        headers: { "Accept-Language": lang },
        next: {
          revalidate: CACHE_TTL.products,
          tags: [`product-${id}`, "products"],
        },
      }
    ).then(normalizeProduct);
  } catch (error) {
    console.error(`[ProductDetail] Failed to fetch product ${id}:`, error);
    notFound();
  }

  // Fetch related products and store settings in parallel — failures are non-fatal.
  const [relatedResult, settingsResult] = await Promise.allSettled([
    product.category?.slug
      ? fetchApi<ApiProduct[]>(
          `/api/site/products?category_slug=${product.category.slug}&per_page=4&locale=${lang}&lang=${lang}`,
          {
            headers: { "Accept-Language": lang },
            next: { revalidate: CACHE_TTL.products, tags: ["products"] },
          }
        )
      : Promise.resolve([] as ApiProduct[]),
    fetchApi<{ settings: ApiStoreSettings }>(
      `/api/site/store-settings?locale=${lang}&lang=${lang}`,
      {
        headers: { "Accept-Language": lang },
        next: { revalidate: CACHE_TTL.storeSettings, tags: ["store-settings"] },
      }
    ),
  ]);

  // Normalise related products — filter out the current product.
  let related: ApiProduct[] = [];
  if (relatedResult.status === "fulfilled") {
    const list = relatedResult.value;
    // Handle both paginated `{ data: [] }` and plain array shapes
    const rawList: ApiProduct[] = Array.isArray(list)
      ? list
      : (list as { data?: ApiProduct[] })?.data ?? [];
    related = normalizeProducts(rawList.filter((p) => String(p.id) !== id).slice(0, 3));
  } else {
    console.error(`[ProductDetail] Failed to fetch related products:`, relatedResult.reason);
  }

  const settings: ApiStoreSettings | null =
    settingsResult.status === "fulfilled"
      ? (settingsResult.value?.settings ?? null)
      : null;

  if (settingsResult.status === "rejected") {
    console.error(`[ProductDetail] Failed to fetch store settings:`, settingsResult.reason);
  }

  // ─── Structured Data ───────────────────────────────────────────────────────
  const productName = product.name[lang] ?? product.name.en ?? "";
  const productDesc = product.description?.[lang] ?? product.description?.en;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: productName,
    image: product.images.map((img) => img.url),
    description: productDesc,
    sku: product.model_number,
    mpn: product.model_number,
    brand: {
      "@type": "Brand",
      name: product.brand?.name ?? "Chrani",
    },
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/products/${product.id}`,
      priceCurrency: "USD",
      price: "0",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "Chrani Company",
      },
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: lang === "ar" ? "الرئيسية" : lang === "ku" ? "ماڵەوە" : "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name:
          lang === "ar"
            ? "المنتجات"
            : lang === "ku"
            ? "بەرهەمەکان"
            : "Products",
        item: `${SITE_URL}/products`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: productName,
        item: `${SITE_URL}/products/${product.id}`,
      },
    ],
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
      <ProductDetailClient product={product} related={related} settings={settings} />
    </>
  );
}
