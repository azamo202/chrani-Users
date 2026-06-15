"use client";

import { useEffect, useState, useCallback, Suspense, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { SlidersHorizontal, X, Search, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useI18n } from "@/i18n/I18nProvider";
import { ProductCard } from "@/components/ProductCard";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { API_BASE_URL, PAGINATION } from "@/lib/constants";
import { ApiCategory, ApiBrand, ApiProduct } from "@/types/api";
import { normalizeProducts } from "@/services/normalizers/productNormalizer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ProductsClientProps {
  initialCategories: ApiCategory[];
  initialBrands: ApiBrand[];
}

// ─── Pagination Component ────────────────────────────────────────────────────

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  dir: "ltr" | "rtl";
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, lastPage, dir, onPageChange }: PaginationProps) => {
  if (lastPage <= 1) return null;

  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(lastPage, currentPage + 2);
  const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  return (
    <nav
      aria-label="Products pagination"
      className="mt-12 flex items-center justify-center gap-2"
      dir="ltr"
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-40"
      >
        <ChevronRight className={cn("h-5 w-5", dir === "rtl" ? "" : "rotate-180")} />
      </button>

      {startPage > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-sm font-semibold transition hover:border-primary hover:text-primary"
          >
            1
          </button>
          {startPage > 2 && <span className="px-1 text-muted-foreground">…</span>}
        </>
      )}

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          aria-current={currentPage === p ? "page" : undefined}
          className={cn(
            "inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-all",
            currentPage === p
              ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
              : "border border-border bg-card hover:border-primary hover:text-primary"
          )}
        >
          {p}
        </button>
      ))}

      {endPage < lastPage && (
        <>
          {endPage < lastPage - 1 && <span className="px-1 text-muted-foreground">…</span>}
          <button
            onClick={() => onPageChange(lastPage)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-sm font-semibold transition hover:border-primary hover:text-primary"
          >
            {lastPage}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === lastPage}
        aria-label="Next page"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-40"
      >
        <ChevronRight className={cn("h-5 w-5", dir === "rtl" ? "rotate-180" : "")} />
      </button>
    </nav>
  );
};

// ─── Product Skeletons ───────────────────────────────────────────────────────

const ProductSkeletons = () => (
  <div className="grid grid-cols-2 gap-3 sm:gap-6 xl:grid-cols-3">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="flex flex-col space-y-3">
        <Skeleton className="aspect-[4/5] w-full rounded-2xl" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    ))}
  </div>
);

// ─── Inner Products Component ────────────────────────────────────────────────

const Products = ({ initialCategories, initialBrands }: ProductsClientProps) => {
  const { t, lang, dir } = useI18n();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // URL state — read once from URL for initial state
  const [selectedBrands, setSelectedBrands] = useState<string[]>(() => {
    const b = searchParams.get("brand_id");
    return b ? [b] : [];
  });
  const [selectedCats, setSelectedCats] = useState<string[]>(() => {
    const c = searchParams.get("category_slug");
    return c ? [c] : [];
  });
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get("search") ?? "");
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedCats, setExpandedCats] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Build category tree from flat list
  const categoryTree = useMemo(() => {
    const hasChildren = initialCategories.some(
      (c) => c.children && c.children.length > 0
    );
    if (hasChildren) return initialCategories;

    const map = new Map<number, ApiCategory & { children: ApiCategory[] }>();
    initialCategories.forEach((cat) => {
      map.set(cat.id, { ...cat, children: cat.children ?? [] });
    });

    const tree: ApiCategory[] = [];
    initialCategories.forEach((cat) => {
      const node = map.get(cat.id);
      if (!node) return;
      if (cat.parent_id && map.has(cat.parent_id)) {
        map.get(cat.parent_id)?.children?.push(node);
      } else if (!cat.parent_id) {
        tree.push(node);
      }
    });
    return tree;
  }, [initialCategories]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCats, selectedBrands, debouncedSearch]);

  // Sync filters to URL (shallow replace — no navigation)
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCats[0]) params.set("category_slug", selectedCats[0]);
    if (selectedBrands[0]) params.set("brand_id", selectedBrands[0]);
    if (debouncedSearch) params.set("search", debouncedSearch);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [selectedCats, selectedBrands, debouncedSearch, pathname, router]);

  // React Query — fetch products client-side
  const { data: productsData, isFetching, isError, error } = useQuery({
    queryKey: [
      "products",
      selectedCats[0],
      selectedBrands[0],
      debouncedSearch,
      currentPage,
      lang,
    ],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedCats[0]) params.append("category_slug", selectedCats[0]);
      if (selectedBrands[0]) params.append("brand_id", selectedBrands[0]);
      if (debouncedSearch) params.append("search", debouncedSearch);
      params.append("page", currentPage.toString());
      params.append("per_page", PAGINATION.defaultPerPage.toString());
      params.append("locale", lang);
      params.append("lang", lang);

      const res = await fetch(`${API_BASE_URL}/api/site/products?${params.toString()}`);
      if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
      
      const json = await res.json() as { data: any[]; meta?: { total: number; last_page: number } };
      return {
        ...json,
        data: normalizeProducts(json.data)
      } as { data: ApiProduct[]; meta?: { total: number; last_page: number } };
    },
    staleTime: 60_000,
  });

  const filtered: ApiProduct[] = productsData?.data ?? [];
  const totalResults = productsData?.meta?.total ?? filtered.length;
  const lastPage = productsData?.meta?.last_page ?? 1;

  const toggle = useCallback(
    (list: string[], v: string) => (list.includes(v) ? [] : [v]),
    []
  );

  const clearAll = useCallback(() => {
    setSelectedBrands([]);
    setSelectedCats([]);
    setSearchQuery("");
    setCurrentPage(1);
    router.push(pathname);
  }, [router, pathname]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const Sidebar = (
    <aside className="space-y-8" aria-label="Product filters">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-bold">{t("filter.title")}</h3>
        <button
          onClick={clearAll}
          className="text-xs font-medium text-primary hover:underline"
        >
          {t("filter.clear")}
        </button>
      </div>

      <div className="relative">
        <Search
          className={cn(
            "absolute top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground",
            dir === "rtl" ? "right-3" : "left-3"
          )}
          aria-hidden="true"
        />
        <Input
          placeholder={t("filter.search")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={cn(dir === "rtl" ? "pr-9" : "pl-9")}
          aria-label={t("filter.search")}
        />
      </div>

      {/* Category filter */}
      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {t("filter.category")}
        </h4>
        <Accordion
          type="multiple"
          value={expandedCats}
          onValueChange={setExpandedCats}
          className="w-full"
        >
          {categoryTree.map((cat) => {
            const hasSub = cat.children && cat.children.length > 0;
            return (
              <AccordionItem
                key={cat.id}
                value={cat.id.toString()}
                className="border-none"
              >
                <div className="flex items-center gap-2 py-1">
                  <Checkbox
                    id={`cat-${cat.id}`}
                    checked={selectedCats.includes(cat.slug)}
                    onCheckedChange={() =>
                      setSelectedCats((s) => toggle(s, cat.slug))
                    }
                    className="h-4 w-4 shrink-0"
                  />
                  <label
                    htmlFor={`cat-${cat.id}`}
                    className="flex-1 cursor-pointer py-1 text-sm transition-colors hover:text-primary text-start"
                  >
                    {cat.name[lang] ?? cat.name.en}
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
                        <label
                          key={sub.id}
                          className="flex cursor-pointer items-center gap-2.5 text-sm transition-colors hover:text-primary"
                        >
                          <Checkbox
                            checked={selectedCats.includes(sub.slug)}
                            onCheckedChange={() =>
                              setSelectedCats((s) => toggle(s, sub.slug))
                            }
                            className="h-3.5 w-3.5 shrink-0"
                          />
                          <span className="flex-1 text-start">
                            {sub.name[lang] ?? sub.name.en}
                          </span>
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

      {/* Brand filter */}
      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {t("filter.brand")}
        </h4>
        <div className="space-y-2.5">
          {initialBrands.map((b) => (
            <label
              key={b.id}
              className="flex cursor-pointer items-center gap-2.5 text-sm"
            >
              <Checkbox
                checked={selectedBrands.includes(b.id.toString())}
                onCheckedChange={() =>
                  setSelectedBrands((s) => toggle(s, b.id.toString()))
                }
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
          <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">
            {t("products.title")}
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            {t("products.subtitle")}
          </p>
        </div>
      </section>

      <section className="container-wide py-10 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
          {/* Desktop sidebar */}
          <div className="hidden lg:block">{Sidebar}</div>

          <div>
            {/* Toolbar */}
            <div className="mb-6 flex items-center justify-between gap-4 rounded-2xl bg-card p-3 shadow-sm border border-border/50 lg:bg-transparent lg:shadow-none lg:border-none lg:p-0">
              <button
                className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/20 lg:hidden"
                onClick={() => setMobileOpen(true)}
                aria-expanded={mobileOpen}
                aria-controls="mobile-sidebar"
              >
                <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
                {t("filter.title")}
              </button>
              <div className="hidden lg:block" />
              <p className="text-sm font-medium text-muted-foreground text-end px-2" aria-live="polite">
                <span className="font-bold text-foreground text-base">
                  {totalResults}
                </span>{" "}
                {t("filter.results")}
              </p>
            </div>

            {/* Product grid */}
            {isFetching ? (
              <ProductSkeletons />
            ) : isError ? (
              <div
                role="alert"
                className="rounded-2xl border border-destructive/20 bg-destructive/5 py-16 text-center shadow-sm"
              >
                <p className="text-destructive font-medium">
                  {lang === "ar"
                    ? "فشل تحميل المنتجات. يرجى التحقق من اتصالك بالإنترنت."
                    : lang === "ku"
                    ? "بارکردنی بەرهەمەکان سەرکەوتوو نەبوو. تکایە هێڵی ئینتەرنێتەکەت بپشکنە."
                    : "Failed to load products. Please check your internet connection."}
                </p>
                {process.env.NODE_ENV === "development" && error && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    {String(error)}
                  </p>
                )}
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 text-sm font-semibold text-primary hover:underline"
                >
                  {lang === "ar"
                    ? "إعادة المحاولة"
                    : lang === "ku"
                    ? "دووبارە هەوڵبدەرەوە"
                    : "Retry"}
                </button>
              </div>
            ) : filtered.length === 0 ? (
              <div className="rounded-2xl border border-dashed py-20 text-center bg-card shadow-sm">
                <p className="text-muted-foreground">{t("products.empty")}</p>
                <button
                  onClick={clearAll}
                  className="mt-4 text-sm font-medium text-primary hover:underline"
                >
                  {t("filter.clear")}
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3 sm:gap-6 xl:grid-cols-3">
                  {filtered.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
                <Pagination
                  currentPage={currentPage}
                  lastPage={lastPage}
                  dir={dir}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </div>
        </div>
      </section>

      {/* Mobile sidebar drawer */}
      <div
        id="mobile-sidebar"
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Product filters"
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
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close filters"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          {Sidebar}
        </div>
      </div>
    </>
  );
};

// ─── Public wrapper with Suspense boundary ───────────────────────────────────

export const ProductsClient = (props: ProductsClientProps) => {
  const { t } = useI18n();
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-muted-foreground">
          {t("products.loading")}
        </div>
      }
    >
      <Products {...props} />
    </Suspense>
  );
};
