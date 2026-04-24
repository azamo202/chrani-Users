"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, MessageCircle, ShieldCheck, Truck, Award } from "lucide-react";
import { visibleProducts, WHATSAPP_NUMBER, categories, brands } from "@/data/catalog";
import { useI18n } from "@/i18n/I18nProvider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard } from "@/components/ProductCard";

const ProductDetail = () => {
  const { id } = useParams() as { id: string };
  const { t, dir } = useI18n();
  const router = useRouter();
  const product = visibleProducts.find((p) => p.id === id);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (!product) router.replace("/products");
  }, [product, router]);

  if (!product) return null;

  const category = categories.find((c) => c.id === product.category);
  const brand = brands.find((b) => b.id === product.brand);
  const related = visibleProducts.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3);

  const whatsappText = encodeURIComponent(
    `Hello, I would like to inquire about the product: ${product.name} - Model: ${product.model}`
  );
  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappText}`;

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
              src={product.images[activeImage]}
              alt={product.name}
              className="aspect-square w-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {product.images.map((src, i) => (
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
            {brand?.name} · {category?.name}
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            {product.name}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {t("product.model")}: <span className="font-medium text-foreground">{product.model}</span>
          </p>
          <p className="mt-6 text-base text-muted-foreground leading-relaxed">{product.description}</p>

          <div className="mt-8 flex items-baseline gap-3">
            <span className="font-display text-4xl font-bold">${product.price.toLocaleString()}</span>
            <span className="text-sm text-muted-foreground">{t("product.vat")}</span>
          </div>

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
            <TabsTrigger value="specs">{t("product.specs")}</TabsTrigger>
            <TabsTrigger value="features">{t("product.features")}</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-8">
            <div className="prose max-w-3xl text-base leading-relaxed text-muted-foreground text-start">
              <p>{product.longDescription}</p>
            </div>
          </TabsContent>

          <TabsContent value="specs" className="mt-8">
            <div className="max-w-3xl divide-y divide-border rounded-xl border border-border">
              {Object.entries(product.specs).map(([k, v]) => (
                <div key={k} className="flex items-center justify-between gap-4 px-5 py-4">
                  <dt className="text-sm font-medium text-muted-foreground">{k}</dt>
                  <dd className="text-sm font-semibold text-end">{v}</dd>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="features" className="mt-8">
            <ul className="grid max-w-3xl gap-3 sm:grid-cols-2">
              {product.features.map((f) => (
                <li key={f} className="flex items-start gap-3 rounded-lg border border-border p-4">
                  <span className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full bg-primary" />
                  <span className="text-sm">{f}</span>
                </li>
              ))}
            </ul>
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

export default ProductDetail;
