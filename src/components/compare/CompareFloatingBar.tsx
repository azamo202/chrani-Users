"use client";

import { useCompare } from "@/hooks/use-compare";
import { cn } from "@/lib/utils";
import { X, GitCompare } from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/i18n/I18nProvider";

export const CompareFloatingBar = () => {
  const { selectedProducts, removeProduct, clearCompare } = useCompare();
  const { t, lang } = useI18n();

  if (selectedProducts.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-50 w-full max-w-2xl -translate-x-1/2 px-4 transition-all duration-500 animate-in slide-in-from-bottom-10 fade-in">
      <div className="flex items-center justify-between rounded-full border border-border/50 bg-background/70 p-3 pr-4 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="flex -space-x-3 overflow-hidden px-2">
            {selectedProducts.map((p, i) => (
              <div
                key={p.id}
                className="relative h-10 w-10 rounded-full border-2 border-background bg-muted shadow-sm"
                style={{ zIndex: 10 - i }}
              >
                <img
                  src={p.image}
                  alt={p.name[lang] || p.name['en']}
                  className="h-full w-full rounded-full object-cover"
                />
                <button
                  onClick={() => removeProduct(p.id)}
                  className="absolute -right-1 -top-1 rounded-full bg-destructive text-destructive-foreground opacity-0 transition-opacity hover:opacity-100 group-hover:opacity-100"
                  aria-label="Remove"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            {Array.from({ length: 4 - selectedProducts.length }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="h-10 w-10 rounded-full border-2 border-dashed border-muted-foreground/30 bg-muted/30"
              />
            ))}
          </div>
          <div className="hidden flex-col sm:flex">
            <span className="text-xs font-medium text-muted-foreground">
              {selectedProducts.length}/4 Selected
            </span>
            <button
              onClick={clearCompare}
              className="text-left text-[10px] uppercase tracking-wider text-primary hover:underline"
            >
              Clear All
            </button>
          </div>
        </div>

        <Link
          href="/compare"
          className={cn(
            "flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:scale-105 hover:bg-primary/90",
            selectedProducts.length < 2 && "pointer-events-none opacity-50 grayscale"
          )}
        >
          <GitCompare className="h-4 w-4" />
          <span className="hidden sm:inline">Compare Now</span>
          <span className="inline sm:hidden">Compare</span>
        </Link>
      </div>
    </div>
  );
};
