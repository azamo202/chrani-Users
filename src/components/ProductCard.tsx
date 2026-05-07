"use client";
import React from "react";

import Link from "next/link";
import { ApiProduct } from "@/types/api";
import { ArrowRight, GitCompare } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCompare } from "@/hooks/use-compare";
import { useI18n } from "@/i18n/I18nProvider";

interface Props {
  product: ApiProduct;
  className?: string;
}

export const ProductCard = ({ product, className }: Props) => {
  const { toggleProduct, isCompared } = useCompare();
  const { lang } = useI18n();
  const compared = isCompared(product.id);

  const primaryImage = React.useMemo(() => {
    if (!product.images || product.images.length === 0) return "https://placehold.co/600x400/f3f4f6/6b7280?text=No+Image";
    // Find primary without mutating the original array
    const primary = product.images.find(img => img.is_primary);
    return primary ? primary.url : product.images[0].url;
  }, [product.images]);

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault(); 
    toggleProduct({
      id: product.id,
      name: product.name,
      image: primaryImage,
      brand: product.brand?.name || "",
      category: product.category.name,
    });
  };

  return (
    <Link
      href={`/products/${product.id}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border border-border/60 bg-card transition-all hover-lift",
        className
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={primaryImage}
          alt={product.name[lang] || product.name['en']}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex gap-2">
          {product.is_active && (
            <span className="rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
              New
            </span>
          )}
        </div>
        <button
          onClick={handleCompare}
          className={cn(
            "absolute right-3 top-3 rounded-full p-2 transition-all duration-300 hover:scale-110",
            compared
              ? "bg-primary text-primary-foreground shadow-md"
              : "bg-background/80 text-muted-foreground opacity-0 backdrop-blur-md hover:bg-background hover:text-foreground group-hover:opacity-100"
          )}
          aria-label={compared ? "Remove from compare" : "Add to compare"}
        >
          <GitCompare className="h-4 w-4" />
        </button>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">{product.brand?.name}</p>
        <h3 className="font-display text-lg font-semibold leading-tight text-foreground line-clamp-2">
          {product.name[lang] || product.name['en']}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{product.description?.[lang] || product.description?.['en']}</p>
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="font-display text-lg font-bold text-transparent selection:text-transparent">
            {/* Price removed as per requirements */}
          </span>
          <span className="flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition group-hover:opacity-100">
            View <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
          </span>
        </div>
      </div>
    </Link>
  );
};
