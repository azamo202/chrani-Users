"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, MessageCircle, ShieldCheck, Truck, Award } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard } from "@/components/ProductCard";
import { ApiProduct, ApiStoreSettings } from "@/types/api";

interface ProductDetailClientProps {
  product: ApiProduct;
  related?: ApiProduct[];
  settings?: ApiStoreSettings | null;
}

export const ProductDetailClient = ({ product, related = [], settings }: ProductDetailClientProps) => {
  const { t, lang, dir } = useI18n();
  const [activeImage, setActiveImage] = useState(0);
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const productName = product.name[lang] || product.name['en'];
  const productDescription = product.description?.[lang] || product.description?.['en'] || "";
  const brandName = product.brand?.name || "";
  const categoryName = product.category?.name[lang] || product.category?.name['en'] || "";

  const whatsappNumber = settings?.whatsapp || "+9647504454864";
  // إزالة أي رموز غير رقمية (مثل علامة الزائد + أو المسافات) لضمان عمل رابط الواتساب
  const cleanWhatsappNumber = whatsappNumber.replace(/[^0-9]/g, "");
  const whatsappText = encodeURIComponent(
    `${t("product.whatsappInquiry")}\n${currentUrl}\n\n${productName}\n${t("product.model")}: ${product.model_number}\n\n${productDescription}`
  );
  const whatsappHref = `https://wa.me/${cleanWhatsappNumber}?text=${whatsappText}`;

  const imageUrls = product.images.length > 0 
    ? product.images.sort((a, b) => Number(b.is_primary) - Number(a.is_primary)).map(i => i.url)
    : ["/fallback-image.png"];

  return (
    <>
      <div className="container-wide pt-6">
        <Link href="/products" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
          <ChevronLeft className="h-4 w-4 rtl:rotate-180" /> {t("nav.products")}
        </Link>
      </div>

      <section className="container-wide grid gap-12 py-8 lg:grid-cols-2 lg:py-12">
        {/* GALLERY */}
        <div>
          <div className="overflow-hidden rounded-2xl border border-border bg-muted/30">
            <img
              src={imageUrls[activeImage]}
              alt={productName}
              className="aspect-square w-full object-cover"
            />
          </div>
          {imageUrls.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {imageUrls.map((src, i) => (
                <button
                  key={src + i}
                  onClick={() => setActiveImage(i)}
                  className={`overflow-hidden rounded-lg border-2 transition ${
                    i === activeImage ? "border-primary" : "border-transparent hover:border-border"
                  }`}
                >
                  <img src={src} alt="" className="aspect-square w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* INFO */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            {brandName} {brandName && categoryName && "·"} {categoryName}
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            {productName}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {t("product.model")}: <span className="font-medium text-foreground">{product.model_number}</span>
          </p>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-primary px-8 py-4 text-base font-semibold text-primary-foreground transition hover:bg-primary-glow hover:shadow-red sm:w-auto"
          >
            <MessageCircle className="h-5 w-5" />
            {t("cta.inquire")}
          </a>

          <div className="mt-8 grid grid-cols-3 gap-4 border-t border-border pt-6">
            {[
              { icon: ShieldCheck, label: t("warranty") },
              { icon: Truck, label: t("delivery") },
              { icon: Award, label: t("service") },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-1.5 text-center">
                <item.icon className="h-5 w-5 text-primary" />
                <span className="text-xs font-medium text-muted-foreground">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TABS */}
      <section className="container-wide pb-16">
        <Tabs defaultValue="description" className="mt-8" dir={dir}>
          <TabsList className="grid w-full max-w-xl grid-cols-3">
            <TabsTrigger value="description">{t("product.description")}</TabsTrigger>
            <TabsTrigger value="features">{t("product.features")}</TabsTrigger>
            <TabsTrigger value="specs">{t("product.specs")}</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-8">
            <div className="prose max-w-3xl text-base leading-relaxed text-muted-foreground text-start">
              <p>{productDescription}</p>
            </div>
          </TabsContent>

          <TabsContent value="features" className="mt-8">
            <ul className="grid max-w-3xl gap-3 sm:grid-cols-2">
              {product.features?.map((f, idx) => (
                <li key={idx} className="flex items-start gap-3 rounded-lg border border-border p-4">
                  <span className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full bg-primary" />
                  <span className="text-sm">{f}</span>
                </li>
              ))}
              {!product.features?.length && (
                <li className="text-sm text-muted-foreground p-4">No features available.</li>
              )}
            </ul>
          </TabsContent>

          <TabsContent value="specs" className="mt-8">
            <div className="max-w-3xl divide-y divide-border rounded-xl border border-border">
              {product.specifications ? (
                Object.entries(product.specifications).map(([groupName, specs]) => (
                  <div key={groupName} className="pb-4">
                    <h3 className="bg-muted/30 px-5 py-2 text-xs font-bold uppercase tracking-widest text-primary">{groupName}</h3>
                    <div className="divide-y divide-border/50">
                      {specs.map((spec, idx) => (
                        <div key={idx} className="flex items-center justify-between gap-4 px-5 py-3">
                          <dt className="text-sm font-medium text-muted-foreground">{spec.key}</dt>
                          <dd className="text-sm font-semibold text-end">{spec.value}</dd>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-5 text-sm text-muted-foreground">No specifications available.</div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* RELATED */}
      {related.length > 0 && (
        <section className="bg-muted/40 py-16">
          <div className="container-wide">
            <h2 className="font-display text-2xl font-bold sm:text-3xl">{t("product.related")}</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};
