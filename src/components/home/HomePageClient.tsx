"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Truck, Sparkles } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { ProductCard } from "@/components/ProductCard";
import { ApiHomeSection, ApiCategory } from "@/types/api";

interface HomePageClientProps {
  sections: ApiHomeSection[];
  categories: ApiCategory[];
}

export const HomePageClient = ({ sections, categories }: HomePageClientProps) => {
  const { t, lang } = useI18n();
  
  // Try to find sections by their type or sort order.
  // Assuming 'featured' and 'new_arrivals' are the section types or titles.
  const categoriesSection = sections.find(s => s.type === "categories" || s.title?.en?.toLowerCase().includes("categories"));
  const featuredSection = sections.find(s => s.type === "featured" || s.title?.en?.toLowerCase().includes("featured")) || sections[0];
  const newArrivalsSection = sections.find(s => s.type === "new_arrivals" || s.title?.en?.toLowerCase().includes("new")) || sections[1];

  const featured = featuredSection?.products || [];
  const newArrivals = newArrivalsSection?.products || [];

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
        <div className="container-wide relative grid items-center gap-12 py-20 lg:grid-cols-2 lg:py-32">
          <div className="animate-fade-up">
            <p className="text-lg md:text-xl font-semibold uppercase tracking-[0.3em] text-primary">
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
        <section className="container-wide py-20">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category_slug=${cat.slug}`}
                className="group relative block aspect-[3/4] overflow-hidden rounded-2xl"
              >
                <img
                  src={cat.image || "/fallback-category.png"}
                  alt={cat.name[lang] || cat.name['en'] || "Category"}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-black/85 via-brand-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <h3 className="font-display text-2xl font-bold">{cat.name[lang] || cat.name['en']}</h3>
                  <p className="mt-1 text-sm text-white/75">{cat.description?.[lang] || cat.description?.['en']}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* FEATURED */}
      {featuredSection && featured.length > 0 && (
        <section className="bg-muted/40 py-20 lg:py-28">
          <div className="container-wide">
            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                  03 — Curated
                </p>
                <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
                  {featuredSection.title[lang] || featuredSection.title['en']}
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

            <div className="mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {featured.map((p) => (
                <div key={p.id} className="w-[85vw] shrink-0 snap-center sm:w-auto">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* NEW ARRIVALS */}
      {newArrivalsSection && newArrivals.length > 0 && (
        <section className="container-wide py-20 lg:py-28">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                04 — Fresh
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
                {newArrivalsSection.title[lang] || newArrivalsSection.title['en']}
              </h2>
            </div>
          </div>
          <div className="mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {newArrivals.map((p) => (
              <div key={p.id} className="w-[85vw] shrink-0 snap-center sm:w-auto">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA STRIP */}
      <section className="container-wide pb-20">
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
