"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Truck, Sparkles } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { ProductCard } from "@/components/ProductCard";
import { ApiHomeSection, ApiCategory } from "@/types/api";
import { cn } from "@/lib/utils";

interface HomePageClientProps {
  sections: ApiHomeSection[];
  categories: ApiCategory[];
}

export const HomePageClient = ({ sections, categories }: HomePageClientProps) => {
  const { t, lang } = useI18n();

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-brand-black text-white">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, hsl(354 78% 46% / 0.45), transparent 55%), radial-gradient(circle at 85% 70%, hsl(354 78% 46% / 0.25), transparent 50%)",
          }}
        />
        <div className="container-wide relative grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <div className="animate-fade-up">
            <p className={cn(
              "text-lg md:text-xl font-semibold uppercase text-primary",
              lang === "en" ? "tracking-[0.3em]" : "tracking-normal"
            )}>
              {" "}
              {t("home.hero.eyebrow")}
            </p>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] text-balance sm:text-5xl lg:text-7xl">
              {t("home.hero.title")}
            </h1>
            <p className="mt-6 max-w-xl text-base text-white/70 sm:text-lg">
              {t("home.hero.subtitle")}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/products"
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-glow hover:shadow-red"
              >
                {t("cta.browse")}
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3.5 text-sm font-semibold text-white transition hover:border-white hover:bg-white/5"
              >
                {t("nav.about")}
              </Link>
            </div>

            <div className="mt-14 grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
              {[
                { icon: ShieldCheck, label: t("warranty") },
                { icon: Truck, label: t("delivery") },
                { icon: Sparkles, label: t("service") },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2.5 text-sm text-white/70"
                >
                  <item.icon className="h-4 w-4 text-primary" />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative animate-fade-in hidden md:block">
            <div className="absolute -inset-8 rounded-full bg-primary/20 blur-3xl" />
            <img
              src="/3.webp"
              alt="Premium kitchen showcase"
              className="relative w-full rounded-2xl object-cover shadow-elegant aspect-[4/5]"
            />
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      {categories.length > 0 && (
        <section className="container-wide py-12 lg:py-20">
          <div className="flex items-end justify-between gap-6 mb-10">
            <div className="text-start">
              <p className={cn(
                "text-xs font-semibold uppercase text-primary",
                lang === "en" ? "tracking-[0.3em]" : "tracking-normal"
              )}>
                {t("home.categories.eyebrow")}
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
                {t("home.categories.main")}
              </h2>
            </div>
            <Link
              href="/products"
              className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:flex"
            >
              {t("cta.viewAll")}{" "}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Link>
          </div>

          <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-8 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-visible sm:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category_slug=${cat.slug}`}
                className="group relative block w-[45vw] shrink-0 snap-center aspect-[4/5] sm:w-auto sm:aspect-[3/4] overflow-hidden rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500"
              >
                <img
                  src={cat.image || "https://placehold.co/600x800/f3f4f6/6b7280?text=Category"}
                  alt={cat.name[lang] || cat.name['en'] || "Category"}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-black/90 via-brand-black/20 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 text-white transition-transform duration-500 group-hover:-translate-y-2">
                  <h3 className="font-display text-2xl font-bold tracking-wide sm:text-3xl">{cat.name[lang] || cat.name['en']}</h3>
                  <p className="mt-2 text-sm text-white/80 line-clamp-2 transform opacity-0 transition-all duration-500 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0">
                    {cat.description?.[lang] || cat.description?.['en'] || (lang === 'ar' ? 'استكشف منتجات هذا التصنيف' : 'Explore products in this category')}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-primary transform opacity-0 transition-all duration-500 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 rtl:translate-x-4 rtl:group-hover:translate-x-0">
                    <span>{t("cta.browse")}</span>
                    <ArrowRight className="h-3 w-3 rtl:rotate-180" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* DYNAMIC SECTIONS */}
      {sections
        .filter((s) => s.is_active && s.products && s.products.length > 0)
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((section, index) => (
          <section
            key={section.id}
            className={cn(
              "py-12 lg:py-20",
              index % 2 === 0 ? "bg-muted/40" : "container-wide"
            )}
          >
            <div className={cn(index % 2 === 0 ? "container-wide" : "")}>
              <div className="flex items-end justify-between gap-6">
                <div>
                  <p className={cn(
                    "text-xs font-semibold uppercase text-primary",
                    lang === "en" ? "tracking-[0.3em]" : "tracking-normal"
                  )}>
                    {`${(index + 3).toString().padStart(2, "0")} — ${
                      (section.type || "section").toUpperCase()
                    }`}
                  </p>
                  <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
                    {section.title[lang] || section.title["en"]}
                  </h2>
                </div>
                <Link
                  href="/products"
                  className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:flex"
                >
                  {t("cta.viewAll")}{" "}
                  <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                </Link>
              </div>

              <div className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {section.products.map((p) => (
                  <div
                    key={p.id}
                    className="w-[48vw] shrink-0 snap-center sm:w-auto"
                  >
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}

      {/* CTA STRIP */}
      <section className="container-wide pb-12 lg:pb-16">
        <div className="relative overflow-hidden rounded-2xl bg-brand-black px-8 py-14 text-white lg:px-16 lg:py-20">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-primary/30 blur-3xl" />
          <div className="relative flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="font-display text-3xl font-bold sm:text-4xl">
                {t("cta.help.title")}
              </h3>
              <p className="mt-2 max-w-xl text-white/70">
                {t("cta.help.subtitle")}
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold transition hover:bg-primary-glow"
            >
              {t("nav.contact")}{" "}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};
