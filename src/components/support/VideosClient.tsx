"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Play, Search, ArrowRight, ArrowLeft } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { ApiVideo } from "@/types/api";

interface VideosClientProps {
  tutorials: ApiVideo[];
}

export const VideosClient = ({ tutorials }: VideosClientProps) => {
  const { t, lang, dir } = useI18n();
  const [searchTerm, setSearchTerm] = useState("");

  const BackArrow = dir === "rtl" ? ArrowRight : ArrowLeft;

  // Filter videos
  const filtered = useMemo(() => {
    if (!searchTerm) return tutorials;
    const term = searchTerm.toLowerCase().trim();
    return tutorials.filter((v) => {
      const titleEn = (v.title?.en || "").toLowerCase();
      const titleAr = (v.title?.ar || "").toLowerCase();
      const titleKu = (v.title?.ku || "").toLowerCase();
      return titleEn.includes(term) || titleAr.includes(term) || titleKu.includes(term);
    });
  }, [tutorials, searchTerm]);

  return (
    <>
      {/* Header */}
      <section className="border-b border-border/60 bg-muted/30">
        <div className="container-wide py-12 lg:py-16">
          <Link
            href="/support"
            className="group mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <BackArrow className="h-4 w-4 transition-transform group-hover:-translate-x-1 rtl:group-hover:translate-x-1" />
            <span>{t("support.back_to_support")}</span>
          </Link>

          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">{t("support.videos")}</p>
          <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl lg:text-5xl">{t("support.videos.title")}</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">{t("support.videos.subtitle")}</p>

          {/* Search */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground rtl:left-auto rtl:right-4" />
              <input
                type="text"
                id="videos-search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t("support.search")}
                className="w-full rounded-full border border-border/60 bg-background py-3.5 pl-12 pr-6 shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary rtl:pl-6 rtl:pr-12"
              />
            </div>

            <span className="text-sm text-muted-foreground">
              {filtered.length} {t("support.items_count")}
            </span>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="container-wide py-16">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filtered.map((v, index) => (
              <div
                key={v.id}
                className="overflow-hidden rounded-xl border border-border bg-card transition hover:shadow-card"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="aspect-video bg-muted">
                  <iframe
                    src={`https://www.youtube.com/embed/${v.youtube_id}`}
                    title={v.title[lang] || v.title["en"]}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full border-0"
                  />
                </div>
                <div className="p-3 sm:p-4">
                  <p className="text-sm font-medium line-clamp-2 sm:text-base" title={v.title[lang] || v.title["en"]}>
                    {v.title[lang] || v.title["en"]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-muted">
              <Play className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="mt-4 text-lg font-medium text-muted-foreground">{t("support.no_results")}</p>
          </div>
        )}
      </section>
    </>
  );
};
