"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { ProductCard } from "@/components/ProductCard";
import { visibleProducts, brands, categories } from "@/data/catalog";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

const MIN = 0;
const MAX = 5000;

const Products = () => {
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCats, setSelectedCats] = useState<string[]>(() => {
    const c = searchParams.get("category");
    return c ? [c] : [];
  });
  const [price, setPrice] = useState<[number, number]>([MIN, MAX]);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const c = searchParams.get("category");
    if (c && !selectedCats.includes(c)) setSelectedCats([c]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const toggle = (list: string[], v: string) =>
    list.includes(v) ? list.filter((x) => x !== v) : [...list, v];

  const clearAll = () => {
    setSelectedBrands([]);
    setSelectedCats([]);
    setPrice([MIN, MAX]);
    router.push(pathname);
  };

  const filtered = useMemo(() => {
    return visibleProducts.filter((p) => {
      if (selectedBrands.length && !selectedBrands.includes(p.brand)) return false;
      if (selectedCats.length && !selectedCats.includes(p.category)) return false;
      if (p.price < price[0] || p.price > price[1]) return false;
      return true;
    });
  }, [selectedBrands, selectedCats, price]);

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
          {categories.map((c) => (
            <label key={c.id} className="flex cursor-pointer items-center gap-2.5 text-sm">
              <Checkbox
                checked={selectedCats.includes(c.id)}
                onCheckedChange={() => setSelectedCats((s) => toggle(s, c.id))}
              />
              <span className="flex-1">{c.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {t("filter.brand")}
        </h4>
        <div className="space-y-2.5">
          {brands.map((b) => (
            <label key={b.id} className="flex cursor-pointer items-center gap-2.5 text-sm">
              <Checkbox
                checked={selectedBrands.includes(b.id)}
                onCheckedChange={() => setSelectedBrands((s) => toggle(s, b.id))}
              />
              <span className="flex-1">{b.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {t("filter.price")}
        </h4>
        <Slider
          min={MIN}
          max={MAX}
          step={50}
          value={price}
          onValueChange={(v) => setPrice([v[0], v[1]] as [number, number])}
        />
        <div className="mt-3 flex justify-between text-sm font-medium">
          <span>${price[0].toLocaleString()}</span>
          <span>${price[1].toLocaleString()}</span>
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

            {filtered.length === 0 ? (
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

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading Catalog...</div>}>
      <Products />
    </Suspense>
  );
}
