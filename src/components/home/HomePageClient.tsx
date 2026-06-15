"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Wind, Sparkles } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { ProductCard } from "@/components/ProductCard";
import { ApiHomeSection, ApiCategory } from "@/types/api";
import { cn } from "@/lib/utils";

interface HomePageClientProps {
  sections: ApiHomeSection[];
  categories: ApiCategory[];
}

export const HomePageClient = ({
  sections,
  categories,
}: HomePageClientProps) => {
  const { t, lang } = useI18n();

  const activeSections = sections
    .filter((s) => s.is_active && s.products && s.products.length > 0)
    .sort((a, b) => a.sort_order - b.sort_order);

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden bg-brand-black text-white"
        aria-label="Hero"
      >
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, hsl(354 78% 46% / 0.45), transparent 55%), radial-gradient(circle at 85% 70%, hsl(354 78% 46% / 0.25), transparent 50%)",
          }}
          aria-hidden="true"
        />
        <div className="container-wide relative grid items-center gap-12 pt-8 pb-8 lg:grid-cols-2 lg:pt-12 lg:pb-12">
          <div className="animate-fade-up">
            <p
              className={cn(
                "text-lg md:text-xl font-semibold uppercase text-primary",
                lang === "en" ? "tracking-[0.3em]" : "tracking-normal"
              )}
            >
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
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 hover:shadow-lg"
              >
                {t("cta.browse")}
                <ArrowRight
                  className="h-4 w-4 transition group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                  aria-hidden="true"
                />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3.5 text-sm font-semibold text-white transition hover:border-white hover:bg-white/5"
              >
                {t("nav.about")}
              </Link>
            </div>

            <div className="mt-14 grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
              {(
                [
                  { icon: Sparkles, label: t("excellence") },
                  { icon: Wind, label: t("elegance") },
                  { icon: ShieldCheck, label: t("warranty") },
                ] as const
              ).map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2.5 text-sm text-white/70"
                >
                  <item.icon
                    className="h-4 w-4 text-primary"
                    aria-hidden="true"
                  />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative animate-fade-in hidden md:block" aria-hidden="true">
            <div className="absolute -inset-8 rounded-full bg-primary/20 blur-3xl" />
            <div className="relative overflow-hidden rounded-2xl shadow-elegant">
              <img
                src="/thisis.jpeg"
                alt="Chrani Showroom"
                className="w-full object-cover aspect-square"
                loading="eager"
                fetchPriority="high"
              />
              <div className="absolute inset-0 bg-primary/20 mix-blend-overlay" />
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ───────────────────────────────────────────────────── */}
      {categories.length > 0 && (
        <section className="container-wide py-6 lg:py-10" aria-label="Categories">
          <div className="flex items-end justify-between gap-6 mb-4">
            <div className="text-start">
              <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
                {t("home.categories.main")}
              </h2>
            </div>
            <Link
              href="/products"
              className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:flex"
            >
              {t("cta.viewAll")}{" "}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
            </Link>
          </div>

          <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 sm:grid sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 sm:overflow-visible sm:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category_slug=${cat.slug}`}
                className="group relative flex flex-col items-center gap-3 w-[45vw] shrink-0 snap-center sm:w-auto"
              >
                <div className="relative w-full aspect-square overflow-hidden rounded-2xl bg-card border border-border/40 shadow-sm transition-all duration-300 sm:group-hover:shadow-md sm:group-hover:border-primary/40 p-5 sm:p-6 flex items-center justify-center">
                  <img
                    src={cat.image || "https://placehold.co/600x400/f3f4f6/6b7280?text=No+Image"}
                    alt={cat.name[lang] ?? cat.name.en ?? "Category"}
                    loading="lazy"
                    className="h-full w-full object-contain mix-blend-multiply dark:mix-blend-normal transition-transform duration-500 sm:group-hover:scale-110"
                  />
                </div>
                <h3 className="font-display text-sm sm:text-base font-bold text-center text-foreground sm:group-hover:text-primary transition-colors line-clamp-1">
                  {cat.name[lang] ?? cat.name.en}
                </h3>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── DYNAMIC PRODUCT SECTIONS ─────────────────────────────────────── */}
      {activeSections.map((section, index) => (
        <section
          key={section.id}
          className={cn(
            "py-6 lg:py-10",
            index % 2 === 0 ? "bg-muted/40" : "container-wide"
          )}
          aria-label={section.title[lang] ?? section.title.en}
        >
          <div className={cn(index % 2 === 0 ? "container-wide" : "")}>
            <div className="flex items-end justify-between gap-6">
              <div>
                <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
                  {section.title[lang] ?? section.title.en}
                </h2>
              </div>
              <Link
                href="/products"
                className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:flex"
              >
                {t("cta.viewAll")}{" "}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
              </Link>
            </div>

            <div className="mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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

      {/* ── CTA STRIP ────────────────────────────────────────────────────── */}
      <section className="container-wide pb-6 lg:pb-10" aria-label="Call to action">
        <div className="relative overflow-hidden rounded-2xl bg-brand-black px-8 py-14 text-white lg:px-16 lg:py-20">
          <div
            className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-primary/30 blur-3xl"
            aria-hidden="true"
          />
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
              className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold transition hover:bg-primary/90"
            >
              {t("nav.contact")}{" "}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};
