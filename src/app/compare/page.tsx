"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useCompare } from "@/hooks/use-compare";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Box, X, AlertCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/I18nProvider";
import { Skeleton } from "@/components/ui/skeleton";

interface ApiProduct {
  id: number;
  name: Record<string, string>;
  images: Array<{ url: string; is_primary: boolean }>;
  brand: { name: string; logo?: string };
  category: { name: Record<string, string> };
  specifications?: Record<string, Array<{ key: string; value: string }>>;
  features?: string[];
}

export default function ComparePage() {
  const { selectedProducts, removeProduct } = useCompare();
  const { t, lang } = useI18n();
  const [showDifferencesOnly, setShowDifferencesOnly] = useState(false);

  // Fetch data
  const { data, isLoading, isError } = useQuery({
    queryKey: ["compareProducts", selectedProducts.map(p => p.id)],
    queryFn: async () => {
      if (selectedProducts.length === 0) return { data: [] };
      const qs = selectedProducts.map(p => `ids[]=${p.id}`).join("&");
      const res = await fetch(`https://chranicatalog-premium.onrender.com/api/site/products/compare?${qs}`);
      if (!res.ok) throw new Error("Failed to fetch compare data");
      return res.json() as Promise<{ data: ApiProduct[] }>;
    },
    enabled: selectedProducts.length > 0,
  });

  const products = data?.data || [];

  // Transform specs into a table-friendly format
  // We want: Array<{ group: string, keys: Array<{ key: string, values: Record<string, string>, isDifferent: boolean }> }>
  const transformedSpecs = useMemo(() => {
    if (!products.length) return [];

    const groupMap = new Map<string, Map<string, Record<string, string>>>();

    // Collect all groups and keys
    products.forEach((product) => {
      const specs = product.specifications || {};
      Object.entries(specs).forEach(([groupName, groupSpecs]) => {
        if (!groupMap.has(groupName)) {
          groupMap.set(groupName, new Map());
        }
        const keyMap = groupMap.get(groupName)!;

        groupSpecs.forEach((spec) => {
          if (!keyMap.has(spec.key)) {
            keyMap.set(spec.key, {});
          }
          keyMap.get(spec.key)![product.id] = spec.value;
        });
      });
    });

    const result: Array<{
      group: string;
      keys: Array<{ key: string; values: Record<string, string>; isDifferent: boolean }>;
    }> = [];

    groupMap.forEach((keyMap, groupName) => {
      const keysResult: Array<{ key: string; values: Record<string, string>; isDifferent: boolean }> = [];
      keyMap.forEach((valuesMap, key) => {
        // Check if values are different among the selected products
        let firstValue: string | undefined = undefined;
        let isDifferent = false;
        
        for (const p of products) {
          const val = valuesMap[p.id] || "-";
          if (firstValue === undefined) {
            firstValue = val;
          } else if (firstValue !== val) {
            isDifferent = true;
            break;
          }
        }

        keysResult.push({
          key,
          values: valuesMap,
          isDifferent,
        });
      });

      result.push({ group: groupName, keys: keysResult });
    });

    return result;
  }, [products]);

  if (selectedProducts.length === 0) {
    return (
      <div className="container flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
        <div className="mb-6 rounded-full bg-primary/10 p-6">
          <Box className="h-12 w-12 text-primary" />
        </div>
        <h1 className="font-display text-3xl font-bold">Compare Products</h1>
        <p className="mt-2 max-w-md text-muted-foreground">
          You haven't selected any products to compare yet. Add products from the catalog to see their features side-by-side.
        </p>
        <Link
          href="/products"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground transition-all hover:bg-primary/90"
        >
          <ArrowLeft className="h-4 w-4" /> Browse Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="container-wide py-10 lg:py-16">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link href="/products" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to Catalog
          </Link>
          <h1 className="mt-4 font-display text-3xl font-bold sm:text-4xl">Product Comparison</h1>
          <p className="mt-2 text-muted-foreground">
            Comparing {selectedProducts.length} {selectedProducts.length === 1 ? "product" : "products"}
          </p>
        </div>
        
        <div className="flex items-center gap-3 rounded-full border border-border/60 bg-muted/30 px-4 py-2">
          <Switch
            id="differences"
            checked={showDifferencesOnly}
            onCheckedChange={setShowDifferencesOnly}
          />
          <label htmlFor="differences" className="cursor-pointer text-sm font-medium">
            Highlight differences
          </label>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-8">
          {[...Array(selectedProducts.length)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-2xl" />
          ))}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/10 p-10 text-destructive">
          <AlertCircle className="mb-4 h-10 w-10" />
          <h2 className="font-bold">Failed to load comparison data</h2>
          <p className="text-sm opacity-80">Please try again later.</p>
        </div>
      ) : (
        <div className="relative overflow-x-auto pb-10">
          {/* Compare Grid */}
          <div className="min-w-[800px]">
            {/* Sticky Header Row */}
            <div className="sticky top-0 z-40 mb-8 grid auto-cols-fr grid-flow-col gap-4 bg-background/80 pb-4 pt-2 backdrop-blur-xl md:gap-8">
              {products.map((product) => {
                const imgUrl = product.images?.find((img) => img.is_primary)?.url || product.images?.[0]?.url || "";
                return (
                  <div key={product.id} className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card p-4 transition-all hover:border-primary/50 hover:shadow-lg">
                    <button
                      onClick={() => removeProduct(product.id)}
                      className="absolute right-3 top-3 z-10 rounded-full bg-background/80 p-1.5 text-muted-foreground opacity-0 backdrop-blur-md transition-all hover:bg-destructive hover:text-destructive-foreground group-hover:opacity-100"
                      aria-label="Remove"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-muted/30">
                      <img src={imgUrl} alt={product.name[lang] || product.name['en']} className="h-full w-full object-contain p-2 mix-blend-multiply dark:mix-blend-normal" />
                    </div>
                    <div className="mt-4 text-center">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        {product.brand?.name}
                      </p>
                      <h3 className="mt-1 font-display text-sm font-semibold leading-tight line-clamp-2">
                        {product.name[lang] || product.name['en']}
                      </h3>
                    </div>
                  </div>
                );
              })}
              {/* Fill empty spots if less than 4 */}
              {Array.from({ length: Math.max(0, 4 - products.length) }).map((_, i) => (
                <div key={`empty-${i}`} className="hidden flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-muted/10 p-4 opacity-50 lg:flex">
                  <Box className="mb-2 h-8 w-8 text-muted-foreground/30" />
                  <span className="text-xs font-medium text-muted-foreground">Add Product</span>
                </div>
              ))}
            </div>

            {/* Specifications Rows */}
            <div className="flex flex-col gap-8">
              {transformedSpecs.map((group, gIdx) => {
                // Filter keys if showDifferencesOnly is active
                const visibleKeys = group.keys.filter(k => !showDifferencesOnly || k.isDifferent);

                if (visibleKeys.length === 0) return null;

                return (
                  <div key={gIdx} className="overflow-hidden rounded-2xl border border-border/60 bg-card">
                    <div className="bg-muted/40 px-6 py-4">
                      <h3 className="font-display font-bold text-foreground">{group.group}</h3>
                    </div>
                    <div className="divide-y divide-border/40">
                      {visibleKeys.map((keyObj, kIdx) => (
                        <div key={kIdx} className={cn("grid auto-cols-fr grid-flow-col gap-4 px-6 py-4 md:gap-8 transition-colors", keyObj.isDifferent && "bg-primary/5")}>
                          {products.map((p) => (
                            <div key={p.id} className="flex flex-col gap-1 border-l border-border/40 pl-4 first:border-0 first:pl-0">
                              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground lg:hidden">
                                {keyObj.key}
                              </span>
                              <div className="hidden lg:block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                                {products[0].id === p.id ? keyObj.key : "\u00A0"}
                              </div>
                              <span className="text-sm font-medium text-foreground">
                                {keyObj.values[p.id] || "—"}
                              </span>
                            </div>
                          ))}
                          {Array.from({ length: Math.max(0, 4 - products.length) }).map((_, i) => (
                            <div key={`empty-val-${i}`} className="hidden lg:block" />
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
