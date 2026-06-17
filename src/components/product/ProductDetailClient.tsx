"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronLeft,
  MessageCircle,
  ShieldCheck,
  Leaf,
  Award,
} from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard } from "@/components/ProductCard";
import { ApiProduct, ApiStoreSettings } from "@/types/api";
import { cn } from "@/lib/utils";

interface ProductDetailClientProps {
  product: ApiProduct;
  related?: ApiProduct[];
  settings?: ApiStoreSettings | null;
}

export const ProductDetailClient = ({
  product,
  related = [],
  settings,
}: ProductDetailClientProps) => {
  const { t, lang, dir } = useI18n();
  const [activeImage, setActiveImage] = useState(0);
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const productName = product.name[lang] ?? product.name.en ?? "";
  const productDescription =
    product.description?.[lang] ?? product.description?.en ?? "";
  const brandName = product.brand?.name ?? "";
  const categoryName =
    product.category?.name[lang] ?? product.category?.name.en ?? "";
  const parentCategoryName =
    product.category?.parent?.name?.[lang] ??
    product.category?.parent?.name?.en ??
    "";

  const whatsappNumber = settings?.whatsapp ?? "+9647504454864";
  const cleanWhatsappNumber = whatsappNumber.replace(/\D/g, "");
  const whatsappText = encodeURIComponent(
    `${t("product.whatsappInquiry")}\n${currentUrl}\n\n${productName}\n${t(
      "product.model"
    )}: ${product.model_number}`
  );
  const whatsappHref = `https://wa.me/${cleanWhatsappNumber}?text=${whatsappText}`;

  // Sort images: primary first
  const imageUrls =
    product.images.length > 0
      ? [...product.images]
          .sort((a, b) => Number(b.is_primary) - Number(a.is_primary))
          .map((i) => i.url)
      : ["https://placehold.co/600x400/f3f4f6/6b7280?text=No+Image"];

  return (
    <>
      {/* Back link */}
      <div className="container-wide pt-6">
        <Link
          href="/products"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ChevronLeft className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
          {t("nav.products")}
        </Link>
      </div>

      {/* Main layout */}
      <section className="container-wide grid gap-12 py-8 lg:grid-cols-2 lg:py-12">
        {/* Gallery */}
        <div>
          <div className="overflow-hidden rounded-2xl border border-border bg-muted/30">
            {/* Use a plain <img> here — src comes from an external API which
                may change; next/image requires explicit domain allow-listing. */}
            <img
              src={imageUrls[activeImage]}
              alt={productName}
              className="aspect-square w-full object-cover"
              loading="eager"
            />
          </div>
          {imageUrls.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-3" role="listbox" aria-label="Product images">
              {imageUrls.map((src, i) => (
                <button
                  key={`${src}-${i}`}
                  role="option"
                  aria-selected={i === activeImage}
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    "overflow-hidden rounded-lg border-2 transition",
                    i === activeImage
                      ? "border-primary"
                      : "border-transparent hover:border-border"
                  )}
                >
                  <img
                    src={src}
                    alt={`${productName} — view ${i + 1}`}
                    className="aspect-square w-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {/* Brand + category header */}
          <div className="flex items-center gap-3 mb-2">
            {product.brand?.logo && (
              <img
                src={product.brand.logo}
                alt={brandName}
                className="h-8 w-auto object-contain"
              />
            )}
            <p
              className={cn(
                "text-sm font-semibold text-primary",
                lang === "en" ? "tracking-wider" : "tracking-normal"
              )}
            >
              {brandName}
              {brandName && (parentCategoryName || categoryName) && " · "}
              {parentCategoryName && `${parentCategoryName} / `}
              {categoryName}
            </p>
          </div>

          <h1 className="mt-3 font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            {productName}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {t("product.model")}:{" "}
            <span className="font-medium text-foreground">
              {product.model_number}
            </span>
          </p>

          {/* WhatsApp CTA */}
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-primary px-8 py-4 text-base font-semibold text-primary-foreground transition hover:bg-primary/90 hover:shadow-lg sm:w-auto"
          >
            <MessageCircle className="h-5 w-5" aria-hidden="true" />
            {t("cta.inquire")}
          </a>

          {/* Trust badges */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              { icon: ShieldCheck, label: t("warranty") },
              { icon: Leaf, label: t("ecoFriendly") },
              { icon: Award, label: t("excellence") },
            ].map((badge) => (
              <div
                key={badge.label}
                className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-muted/30 p-3 text-center"
              >
                <badge.icon
                  className="h-5 w-5 text-primary"
                  aria-hidden="true"
                />
                <span className="text-[10px] font-medium text-muted-foreground leading-tight">
                  {badge.label}
                </span>
              </div>
            ))}
          </div>

          {/* Product tabs */}
          <div className="mt-8 border-t border-border pt-6">
            <Tabs defaultValue="description" className="w-full" dir={dir}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description" className="text-xs">
                  {t("product.description")}
                </TabsTrigger>
                <TabsTrigger value="features" className="text-xs">
                  {t("product.features")}
                </TabsTrigger>
                <TabsTrigger value="specs" className="text-xs">
                  {t("product.specs")}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-6">
                <div className="prose prose-sm max-w-full text-muted-foreground leading-loose">
                  {productDescription ? (
                    <p className="whitespace-pre-line">{productDescription}</p>
                  ) : (
                    <p className="text-xs text-muted-foreground italic">
                      {lang === "ar" ? "لا يوجد وصف." : lang === "ku" ? "وەسفی نییە." : "No description available."}
                    </p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="features" className="mt-6">
                <ul className="grid gap-2">
                  {product.features && product.features.length > 0 ? (
                    product.features.map((f, idx) => {
                      // API may return features as strings OR as {en,ar,ku} objects
                      const featureText: string =
                        typeof f === "string"
                          ? f
                          : (f as any)?.[lang] ?? (f as any)?.en ?? String(f);
                      return (
                        <li
                          key={idx}
                          className="flex items-start gap-2 rounded-lg border border-border p-3"
                        >
                          <span
                            className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                            aria-hidden="true"
                          />
                          <span className="text-xs">{featureText}</span>
                        </li>
                      );
                    })
                  ) : (
                    <li className="text-xs text-muted-foreground p-2">
                      {lang === "ar" ? "لا توجد مميزات." : lang === "ku" ? "تایبەتمەندی نییە." : "No features available."}
                    </li>
                  )}
                </ul>
              </TabsContent>

              <TabsContent value="specs" className="mt-6">
                <div className="space-y-4">
                  {product.specifications &&
                  Object.keys(product.specifications).length > 0 ? (
                    Object.entries(product.specifications).map(
                      ([groupName, specs]) => {
                        let parsedGroup: any = groupName;
                        if (typeof groupName === "string") {
                          try {
                            const trimmed = groupName.trim();
                            if (trimmed.startsWith("{")) {
                              parsedGroup = JSON.parse(trimmed);
                            }
                          } catch (e) {}
                        }
                        
                        let localGroupName: string = String(groupName);
                        if (typeof parsedGroup === "object" && parsedGroup !== null) {
                          const langUpper = lang.toUpperCase();
                          if (parsedGroup[lang]) {
                            localGroupName = parsedGroup[lang];
                          } else if (parsedGroup[langUpper]) {
                            localGroupName = parsedGroup[langUpper];
                          } else if (parsedGroup["en"]) {
                            localGroupName = parsedGroup["en"];
                          } else if (parsedGroup["EN"]) {
                            localGroupName = parsedGroup["EN"];
                          } else if (parsedGroup["ar"]) {
                            localGroupName = parsedGroup["ar"];
                          } else if (parsedGroup["AR"]) {
                            localGroupName = parsedGroup["AR"];
                          } else {
                            const firstVal = Object.values(parsedGroup)[0];
                            if (firstVal) localGroupName = String(firstVal);
                          }
                        }

                        return (
                          <div
                            key={groupName}
                            className="rounded-xl border border-border overflow-hidden"
                          >
                            <h3 className="bg-muted/30 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-primary">
                              {localGroupName}
                            </h3>
                            <dl className="divide-y divide-border/50">
                              {specs.map((spec, idx) => {
                                // key & value may be translatable objects too
                                const specKey: string =
                                  typeof spec.key === "string"
                                    ? spec.key
                                    : (spec.key as any)?.[lang] ??
                                      (spec.key as any)?.en ??
                                      String(spec.key);
                                const specValue: string =
                                  typeof spec.value === "string"
                                    ? spec.value
                                    : (spec.value as any)?.[lang] ??
                                      (spec.value as any)?.en ??
                                      String(spec.value);
                                return (
                                  <div
                                    key={idx}
                                    className="flex items-center justify-between gap-4 px-4 py-2"
                                  >
                                    <dt className="text-[11px] font-medium text-muted-foreground">
                                      {specKey}
                                    </dt>
                                    <dd className="text-[11px] font-semibold text-end">
                                      {specValue}
                                    </dd>
                                  </div>
                                );
                              })}
                            </dl>
                          </div>
                        );
                      }
                    )
                  ) : (
                    <div className="text-xs text-muted-foreground">
                      {lang === "ar" ? "لا توجد مواصفات." : lang === "ku" ? "تایبەتمەندی تەکنیکی نییە." : "No specifications available."}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Related products */}
      {related.length > 0 && (
        <section className="bg-muted/40 py-16" aria-label="Related products">
          <div className="container-wide">
            <h2 className="font-display text-2xl font-bold sm:text-3xl">
              {t("product.related")}
            </h2>
            <div className="mt-8 flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory sm:grid sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 sm:overflow-x-visible sm:pb-0">
              {related.map((p) => (
                <div
                  key={p.id}
                  className="w-[280px] shrink-0 snap-start sm:w-auto"
                >
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};
