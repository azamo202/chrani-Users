"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { FileText, Download, Search, ArrowRight, ArrowLeft } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { ApiDownload } from "@/types/api";

interface DownloadsClientProps {
  manuals: ApiDownload[];
}

export const DownloadsClient = ({ manuals }: DownloadsClientProps) => {
  const { t, lang, dir } = useI18n();
  const [searchTerm, setSearchTerm] = useState("");

  const BackArrow = dir === "rtl" ? ArrowRight : ArrowLeft;

  // Filter manuals
  const filtered = useMemo(() => {
    if (!searchTerm) return manuals;
    const term = searchTerm.toLowerCase().trim();
    return manuals.filter((m) => {
      const titleEn = (m.title?.en || "").toLowerCase();
      const titleAr = (m.title?.ar || "").toLowerCase();
      const titleKu = (m.title?.ku || "").toLowerCase();
      return titleEn.includes(term) || titleAr.includes(term) || titleKu.includes(term);
    });
  }, [manuals, searchTerm]);

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

          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">{t("support.downloads")}</p>
          <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl lg:text-5xl">{t("support.downloads.title")}</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">{t("support.downloads.subtitle")}</p>

          {/* Search */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground rtl:left-auto rtl:right-4" />
              <input
                type="text"
                id="downloads-search"
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
      <section className="bg-muted/40 py-16">
        <div className="container-wide">
          {filtered.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {filtered.map((m, index) => (
                <a
                  key={m.id}
                  href={m.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-xl border border-border bg-card p-5 transition hover:border-primary/40 hover:shadow-card"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium break-words whitespace-normal line-clamp-2">{m.title[lang] || m.title["en"]}</p>
                    {m.file_size && <p className="text-xs text-muted-foreground">PDF · {m.file_size}</p>}
                  </div>
                  <Download className="h-5 w-5 text-muted-foreground transition group-hover:text-primary" />
                </a>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-muted">
                <FileText className="h-7 w-7 text-muted-foreground" />
              </div>
              <p className="mt-4 text-lg font-medium text-muted-foreground">{t("support.no_results")}</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};
