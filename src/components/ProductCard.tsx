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
    if (!product.images || product.images.length === 0) {
      return "https://placehold.co/600x400/f3f4f6/6b7280?text=No+Image";
    }

    const primary = product.images.find(img => img.is_primary);

    return (primary || product.images[0]).url;
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
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/40 bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg",
        className
      )}
    >
      <div className="relative w-full shrink-0 aspect-square overflow-hidden bg-muted/40 p-4 flex items-center justify-center">
        <img
          src={primaryImage}
          alt={product.name[lang] || product.name['en']}
          loading="lazy"
          className="h-full w-full object-contain mix-blend-multiply dark:mix-blend-normal transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute start-3 top-3 flex gap-2">
          {product.brand?.name && (
            <span className={cn(
              "rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold font-display text-primary-foreground shadow-sm",
              lang === "en" ? "tracking-wider" : "tracking-normal"
            )}>
              {product.brand.name}
            </span>
          )}
        </div>
        <button
          onClick={handleCompare}
          className={cn(
            "absolute end-3 top-3 rounded-full p-2 transition-all duration-300 hover:scale-110",
            compared
              ? "bg-primary text-primary-foreground shadow-md"
              : "bg-background/80 text-muted-foreground opacity-0 backdrop-blur-md hover:bg-background hover:text-foreground group-hover:opacity-100"
          )}
          aria-label={compared ? "Remove from compare" : "Add to compare"}
        >
          <GitCompare className="h-4 w-4" />
        </button>
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5 text-start">
        <div className="mb-2 flex items-center gap-2">
          {product.brand?.logo && (
            <img
              src={product.brand.logo}
              alt={product.brand.name}
              className="h-4 w-auto object-contain opacity-80"
            />
          )}
          <p className={cn(
            "text-[10px] sm:text-xs font-bold text-muted-foreground",
            lang === "en" ? "tracking-wider" : "tracking-normal"
          )}>
            {product.brand?.name}
          </p>
        </div>
        <h3 className="font-display text-sm sm:text-lg font-bold leading-snug text-foreground line-clamp-2">
          {product.name[lang] || product.name['en']}
        </h3>
        <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground line-clamp-2">{product.description?.[lang] || product.description?.['en']}</p>

        <div className="mt-auto flex justify-end pt-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/5 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-md sm:h-10 sm:w-10">
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </div>
        </div>
      </div>
    </Link>
  );
};
