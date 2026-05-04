"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useI18n } from "@/i18n/I18nProvider";
import { ProductCard } from "@/components/ProductCard";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { fetchApi } from "@/lib/api";
import { ApiCategory, ApiBrand, ApiProduct, ApiResponse } from "@/types/api";

interface ProductsClientProps {
  initialCategories: ApiCategory[];
  initialBrands: ApiBrand[];
}

const Products = ({ initialCategories, initialBrands }: ProductsClientProps) => {
  const { t, lang } = useI18n();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // URL state
  const initialCategorySlug = searchParams.get("category_slug");
  const initialBrandId = searchParams.get("brand_id");

  const [selectedBrands, setSelectedBrands] = useState<string[]>(initialBrandId ? [initialBrandId] : []);
  const [selectedCats, setSelectedCats] = useState<string[]>(initialCategorySlug ? [initialCategorySlug] : []);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Sync state to URL without reloading
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCats.length > 0) params.set("category_slug", selectedCats[0]); // Only one category at a time for the API or comma separated? Let's use the first one or pass as array. The prompt says "?category_slug=slug". We will use the first selected.
    if (selectedBrands.length > 0) params.set("brand_id", selectedBrands[0]);
    
    // Replace URL to avoid infinite history pushing
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [selectedCats, selectedBrands, pathname, router]);

  const categorySlugParam = selectedCats[0] || "";
  const brandIdParam = selectedBrands[0] || "";

  // React Query to fetch products
  const { data: productsData, isFetching } = useQuery({
    queryKey: ["products", categorySlugParam, brandIdParam],
    queryFn: async () => {
      let url = "/api/site/products?";
      const params = new URLSearchParams();
      if (categorySlugParam) params.append("category_slug", categorySlugParam);
      if (brandIdParam) params.append("brand_id", brandIdParam);
      
      const response = await fetchApi<any>(url + params.toString());
      // The API might return paginated { data: [...] } or just an array
      const productsList: ApiProduct[] = Array.isArray(response) ? response : (response.data || []);
      return productsList;
    },
    staleTime: 60000,
  });

  const filtered = productsData || [];

  const toggle = (list: string[], v: string) =>
    list.includes(v) ? [] : [v]; // Single select since the API seems to expect one category_slug and one brand_id

  const clearAll = () => {
    setSelectedBrands([]);
    setSelectedCats([]);
    router.push(pathname);
  };

  const Sidebar = (
    <aside className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-bold">Filters</h3>
        <button onClick={clearAll} className="text-xs font-medium text-primary hover:underline">
          {t("filter.clear")}
        </button>
      </div>

      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {t("filter.category")}
        </h4>
        <div className="space-y-2.5">
          {initialCategories.map((c) => (
            <label key={c.id} className="flex cursor-pointer items-center gap-2.5 text-sm">
              <Checkbox
                checked={selectedCats.includes(c.slug)}
                onCheckedChange={() => setSelectedCats((s) => toggle(s, c.slug))}
              />
              <span className="flex-1">{c.name[lang] || c.name['en']}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {t("filter.brand")}
        </h4>
        <div className="space-y-2.5">
          {initialBrands.map((b) => (
            <label key={b.id} className="flex cursor-pointer items-center gap-2.5 text-sm">
              <Checkbox
                checked={selectedBrands.includes(b.id.toString())}
                onCheckedChange={() => setSelectedBrands((s) => toggle(s, b.id.toString()))}
              />
              <span className="flex-1">{b.name}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Header */}
      <section className="border-b border-border/60 bg-muted/30">
        <div className="container-wide py-12 lg:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Catalog</p>
          <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">{t("products.title")}</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">{t("products.subtitle")}</p>
        </div>
      </section>

      <section className="container-wide py-10 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
          <div className="hidden lg:block">{Sidebar}</div>

          <div>
            <div className="mb-6 flex items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{filtered.length}</span> {t("filter.results")}
              </p>
              <button
                className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium lg:hidden"
                onClick={() => setMobileOpen(true)}
              >
                <SlidersHorizontal className="h-4 w-4" /> Filters
              </button>
            </div>

            {isFetching ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex flex-col space-y-3">
                    <Skeleton className="h-64 w-full rounded-xl" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="rounded-xl border border-dashed py-20 text-center">
                <p className="text-muted-foreground">No products match these filters.</p>
                <button onClick={clearAll} className="mt-4 text-sm font-medium text-primary hover:underline">
                  {t("filter.clear")}
                </button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Mobile sidebar drawer */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        <div
          className={cn(
            "absolute inset-0 bg-black/50 transition-opacity",
            mobileOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-background p-6 transition-transform",
            mobileOpen ? "translate-y-0" : "translate-y-full"
          )}
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-lg font-bold">Filters</h3>
            <button onClick={() => setMobileOpen(false)}>
              <X className="h-5 w-5" />
            </button>
          </div>
          {Sidebar}
        </div>
      </div>
    </>
  );
};

export const ProductsClient = (props: ProductsClientProps) => {
  return (
    <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading Catalog...</div>}>
      <Products {...props} />
    </Suspense>
  );
}
