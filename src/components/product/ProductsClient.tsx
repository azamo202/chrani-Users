"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { SlidersHorizontal, X, Search, ChevronRight, ChevronDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useI18n } from "@/i18n/I18nProvider";
import { ProductCard } from "@/components/ProductCard";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { fetchApi } from "@/lib/api";
import { ApiCategory, ApiBrand, ApiProduct } from "@/types/api";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import React from "react";

interface ProductsClientProps {
  initialCategories: ApiCategory[];
  initialBrands: ApiBrand[];
}

const Products = ({ initialCategories, initialBrands }: ProductsClientProps) => {
  const { t, lang, dir } = useI18n();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // URL state
  const initialCategorySlug = searchParams.get("category_slug");
  const initialBrandId = searchParams.get("brand_id");
  const initialSearch = searchParams.get("search") || "";

  const [selectedBrands, setSelectedBrands] = useState<string[]>(initialBrandId ? [initialBrandId] : []);
  const [selectedCats, setSelectedCats] = useState<string[]>(initialCategorySlug ? [initialCategorySlug] : []);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedCats, setExpandedCats] = useState<string[]>([]);

  // Build category tree
  const categoryTree = React.useMemo(() => {
    // If already has children, use as is (or assume flat and build)
    const hasChildren = initialCategories.some(c => c.children && c.children.length > 0);
    if (hasChildren) return initialCategories;

    const map = new Map<number, ApiCategory & { children: ApiCategory[] }>();
    initialCategories.forEach(cat => {
      map.set(cat.id, { ...cat, children: cat.children || [] });
    });
    
    const tree: ApiCategory[] = [];
    initialCategories.forEach(cat => {
      const node = map.get(cat.id)!;
      if (cat.parent_id && map.has(cat.parent_id)) {
        map.get(cat.parent_id)!.children?.push(node);
      } else if (!cat.parent_id) {
        tree.push(node);
      }
    });
    return tree;
  }, [initialCategories]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Sync state to URL without reloading
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCats.length > 0) params.set("category_slug", selectedCats[0]);
    if (selectedBrands.length > 0) params.set("brand_id", selectedBrands[0]);
    if (debouncedSearch) params.set("search", debouncedSearch);
    
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [selectedCats, selectedBrands, debouncedSearch, pathname, router]);

  // React Query to fetch products
  const { data: productsData, isFetching } = useQuery({
    queryKey: ["products", selectedCats[0], selectedBrands[0], debouncedSearch],
    queryFn: async () => {
      let url = "/api/site/products?";
      const params = new URLSearchParams();
      
      if (selectedCats[0]) params.append("category_slug", selectedCats[0]);
      if (selectedBrands[0]) params.append("brand_id", selectedBrands[0]);
      if (debouncedSearch) params.append("search", debouncedSearch);
      
      const response = await fetchApi<any>(url + params.toString());
      const productsList: ApiProduct[] = Array.isArray(response) ? response : (response.data || []);
      return productsList;
    },
    staleTime: 60000,
  });

  const filtered = productsData || [];

  const toggle = (list: string[], v: string) =>
    list.includes(v) ? [] : [v];

  const clearAll = () => {
    setSelectedBrands([]);
    setSelectedCats([]);
    setSearchQuery("");
    router.push(pathname);
  };

  const Sidebar = (
    <aside className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-bold">{t("filter.title")}</h3>
        <button onClick={clearAll} className="text-xs font-medium text-primary hover:underline">
          {t("filter.clear")}
        </button>
      </div>

      <div className="relative">
        <Search className={cn(
          "absolute top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground",
          dir === "rtl" ? "right-3" : "left-3"
        )} />
        <Input
          placeholder={t("filter.search")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={cn(dir === "rtl" ? "pr-9" : "pl-9")}
        />
      </div>

      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {t("filter.category")}
        </h4>
        <div className="space-y-1">
          <Accordion type="multiple" value={expandedCats} onValueChange={setExpandedCats} className="w-full">
            {categoryTree.map((cat) => {
              const hasSub = cat.children && cat.children.length > 0;
              return (
                <AccordionItem key={cat.id} value={cat.id.toString()} className="border-none">
                  <div className="flex items-center gap-2 py-1">
                    <Checkbox
                      id={`cat-${cat.id}`}
                      checked={selectedCats.includes(cat.slug)}
                      onCheckedChange={() => setSelectedCats((s) => toggle(s, cat.slug))}
                      className="h-4 w-4 shrink-0"
                    />
                    <label 
                      htmlFor={`cat-${cat.id}`}
                      className="flex-1 cursor-pointer py-1 text-sm transition-colors hover:text-primary text-start"
                    >
                      {cat.name[lang] || cat.name['en']}
                    </label>
                    {hasSub && (
                      <AccordionTrigger className="flex-none p-1 py-1 hover:no-underline [&>svg]:h-4 [&>svg]:w-4">
                        <span className="sr-only">Toggle subcategories</span>
                      </AccordionTrigger>
                    )}
                  </div>
                  {hasSub && (
                    <AccordionContent className="ps-6 pb-2">
                      <div className="space-y-2 pt-1 border-s border-border/60 ms-2 ps-4">
                        {cat.children?.map((sub) => (
                          <label key={sub.id} className="flex cursor-pointer items-center gap-2.5 text-sm transition-colors hover:text-primary">
                            <Checkbox
                              checked={selectedCats.includes(sub.slug)}
                              onCheckedChange={() => setSelectedCats((s) => toggle(s, sub.slug))}
                              className="h-3.5 w-3.5 shrink-0"
                            />
                            <span className="flex-1 text-start">{sub.name[lang] || sub.name['en']}</span>
                          </label>
                        ))}
                      </div>
                    </AccordionContent>
                  )}
                </AccordionItem>
              );
            })}
          </Accordion>
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

          <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">{t("products.title")}</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">{t("products.subtitle")}</p>
        </div>
      </section>

      <section className="container-wide py-10 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
          <div className="hidden lg:block">{Sidebar}</div>

          <div>
            <div className="mb-6 flex items-center justify-between gap-4 rounded-2xl bg-card p-3 shadow-sm border border-border/50 lg:bg-transparent lg:shadow-none lg:border-none lg:p-0">
              <button
                className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/20 lg:hidden"
                onClick={() => setMobileOpen(true)}
              >
                <SlidersHorizontal className="h-4 w-4" /> {t("filter.title")}
              </button>
              <div className="hidden lg:block"></div>
              <p className="text-sm font-medium text-muted-foreground text-end px-2">
                <span className="font-bold text-foreground text-base">{filtered.length}</span> {t("filter.results")}
              </p>
            </div>

            {isFetching ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-6 xl:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex flex-col space-y-3">
                    <Skeleton className="aspect-[4/5] w-full rounded-2xl" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="rounded-2xl border border-dashed py-20 text-center bg-card shadow-sm">
                <p className="text-muted-foreground">{t("products.empty")}</p>
                <button onClick={clearAll} className="mt-4 text-sm font-medium text-primary hover:underline">
                  {t("filter.clear")}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:gap-6 xl:grid-cols-3">
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
            <h3 className="font-display text-lg font-bold">{t("filter.title")}</h3>
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
  const { t } = useI18n();
  return (
    <Suspense fallback={<div className="p-8 text-center text-muted-foreground">{t("products.loading")}</div>}>
      <Products {...props} />
    </Suspense>
  );
}
