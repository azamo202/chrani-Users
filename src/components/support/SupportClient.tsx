"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { FileText, Download, MapPin, Phone, Clock, Search, Map, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/i18n/I18nProvider";
import { ApiMaintenanceCenter, ApiVideo, ApiDownload } from "@/types/api";
import { PhoneNumbersDisplay } from "@/components/PhoneNumbersDisplay";

const PREVIEW_LIMIT = 4;

interface SupportClientProps {
  manuals: ApiDownload[];
  tutorials: ApiVideo[];
  serviceCenters: ApiMaintenanceCenter[];
  initialSearch?: string;
}

export const SupportClient = ({ manuals, tutorials, serviceCenters, initialSearch = "" }: SupportClientProps) => {
  const { t, lang, dir } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(initialSearch);

  const ArrowIcon = dir === "rtl" ? ArrowLeft : ArrowRight;

  useEffect(() => {
    const currentSearch = searchParams.get("search") || "";
    if (searchTerm === currentSearch) return;

    const delayDebounceFn = setTimeout(() => {
      const currentParams = new URLSearchParams(Array.from(searchParams.entries()));
      
      if (searchTerm) {
        currentParams.set("search", searchTerm);
      } else {
        currentParams.delete("search");
      }
      
      router.push(`${pathname}?${currentParams.toString()}`, { scroll: false });
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, router, pathname, searchParams]);

  // Client-side case-insensitive filtering
  const filteredManuals = manuals.filter((m) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase().trim();
    const titleEn = (m.title?.en || "").toLowerCase();
    const titleAr = (m.title?.ar || "").toLowerCase();
    const titleKu = (m.title?.ku || "").toLowerCase();
    return titleEn.includes(term) || titleAr.includes(term) || titleKu.includes(term);
  });

  const filteredTutorials = tutorials.filter((v) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase().trim();
    const titleEn = (v.title?.en || "").toLowerCase();
    const titleAr = (v.title?.ar || "").toLowerCase();
    const titleKu = (v.title?.ku || "").toLowerCase();
    return titleEn.includes(term) || titleAr.includes(term) || titleKu.includes(term);
  });

  const filteredServiceCenters = serviceCenters.filter((c) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase().trim();
    const nameEn = (c.name?.en || "").toLowerCase();
    const nameAr = (c.name?.ar || "").toLowerCase();
    const nameKu = (c.name?.ku || "").toLowerCase();
    const cityEn = (c.city?.en || "").toLowerCase();
    const cityAr = (c.city?.ar || "").toLowerCase();
    const cityKu = (c.city?.ku || "").toLowerCase();
    const addressEn = (c.address?.en || "").toLowerCase();
    const addressAr = (c.address?.ar || "").toLowerCase();
    const addressKu = (c.address?.ku || "").toLowerCase();
    
    return (
      nameEn.includes(term) ||
      nameAr.includes(term) ||
      nameKu.includes(term) ||
      cityEn.includes(term) ||
      cityAr.includes(term) ||
      cityKu.includes(term) ||
      addressEn.includes(term) ||
      addressAr.includes(term) ||
      addressKu.includes(term)
    );
  });

  // Sliced previews (max 4 for general, 6 for videos)
  const previewCenters = filteredServiceCenters.slice(0, PREVIEW_LIMIT);
  const previewManuals = filteredManuals.slice(0, PREVIEW_LIMIT);
  const previewTutorials = filteredTutorials.slice(0, 6);

  return (
    <>
      <section className="border-b border-border/60 bg-muted/30">
        <div className="container-wide py-12 lg:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Support</p>
          <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl lg:text-5xl">{t("support.title")}</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">{t("support.subtitle")}</p>

          <div className="mt-8 relative max-w-xl">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground rtl:left-auto rtl:right-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t("support.search")}
              className="w-full rounded-full border border-border/60 bg-background py-4 pl-12 pr-6 shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary rtl:pl-6 rtl:pr-12"
            />
          </div>
        </div>
      </section>

      {/* Service Centers */}
      {filteredServiceCenters.length > 0 && (
        <section className="container-wide py-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-4">
            <h2 className="font-display text-2xl font-bold sm:text-3xl">{t("support.centers")}</h2>
            {filteredServiceCenters.length > PREVIEW_LIMIT && (
              <span className="text-sm text-muted-foreground">
                {filteredServiceCenters.length} {t("support.items_count")}
              </span>
            )}
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {previewCenters.map((c) => (
              <div key={c.id} className="rounded-xl border border-border bg-card p-6 transition hover:shadow-card">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-xl font-bold break-words whitespace-normal">
                      {c.name?.[lang] || c.name?.['en'] || c.city[lang] || c.city['en']}
                    </h3>
                    <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-0.5 text-sm font-bold text-primary">
                      <Map className="h-3.5 w-3.5" />
                      <span>{c.city[lang] || c.city['en']}</span>
                    </div>
                  </div>
                  {c.location_link && (
                    <a 
                      href={c.location_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary transition hover:bg-primary hover:text-white"
                      title={t("support.view_on_map")}
                    >
                      <MapPin className="h-4 w-4" />
                    </a>
                  )}
                </div>
                <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2.5">
                    <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                    <span>{c.address[lang] || c.address['en']}</span>
                  </li>
                  <li className="pt-2">
                    <PhoneNumbersDisplay phone={c.phone} />
                  </li>
                  {c.working_hours && (
                    <li className="flex items-start gap-2.5">
                      <Clock className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                      <span>{c.working_hours[lang] || c.working_hours['en']}</span>
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>
          {filteredServiceCenters.length > PREVIEW_LIMIT && (
            <div className="mt-8 flex justify-center">
              <Link
                href="/support/centers"
                id="show-more-centers"
                className="group inline-flex items-center gap-2.5 rounded-full border border-primary/30 bg-primary/5 px-8 py-3.5 text-sm font-semibold text-primary transition-all hover:border-primary hover:bg-primary hover:text-white hover:shadow-[0_12px_32px_-12px_hsl(354_78%_46%/0.4)]"
              >
                <span>{t("support.show_more")}</span>
                <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
              </Link>
            </div>
          )}
        </section>
      )}

      {/* Manuals */}
      {filteredManuals.length > 0 && (
        <section className="bg-muted/40 py-16">
          <div className="container-wide">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-4">
              <h2 className="font-display text-2xl font-bold sm:text-3xl">{t("support.downloads")}</h2>
              {filteredManuals.length > PREVIEW_LIMIT && (
                <span className="text-sm text-muted-foreground">
                  {filteredManuals.length} {t("support.items_count")}
                </span>
              )}
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {previewManuals.map((m) => (
                <a
                  key={m.id}
                  href={m.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-xl border border-border bg-card p-5 transition hover:border-primary/40 hover:shadow-card"
                >
                  <div className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium break-words whitespace-normal line-clamp-2">{m.title[lang] || m.title['en']}</p>
                    {m.file_size && <p className="text-xs text-muted-foreground">PDF · {m.file_size}</p>}
                  </div>
                  <Download className="h-5 w-5 text-muted-foreground transition group-hover:text-primary" />
                </a>
              ))}
            </div>
            {filteredManuals.length > PREVIEW_LIMIT && (
              <div className="mt-8 flex justify-center">
                <Link
                  href="/support/downloads"
                  id="show-more-downloads"
                  className="group inline-flex items-center gap-2.5 rounded-full border border-primary/30 bg-primary/5 px-8 py-3.5 text-sm font-semibold text-primary transition-all hover:border-primary hover:bg-primary hover:text-white hover:shadow-[0_12px_32px_-12px_hsl(354_78%_46%/0.4)]"
                >
                  <span>{t("support.show_more")}</span>
                  <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Videos */}
      {filteredTutorials.length > 0 && (
        <section className="container-wide py-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-4">
            <h2 className="font-display text-2xl font-bold sm:text-3xl">{t("support.videos")}</h2>
            {filteredTutorials.length > 6 && (
              <span className="text-sm text-muted-foreground">
                {filteredTutorials.length} {t("support.items_count")}
              </span>
            )}
          </div>
          <div className="-mx-4 mt-8 flex gap-4 overflow-x-auto px-4 pb-6 snap-x snap-mandatory sm:mx-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:overflow-visible sm:px-0 sm:pb-0 sm:snap-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {previewTutorials.map((v) => (
              <div key={v.id} className="w-[85vw] shrink-0 snap-center overflow-hidden rounded-xl border border-border bg-card sm:w-auto sm:shrink transition hover:shadow-card">
                <div className="aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${v.youtube_id}`}
                    title={v.title[lang] || v.title['en']}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full"
                  />
                </div>
                <div className="p-5">
                  <p className="font-medium">{v.title[lang] || v.title['en']}</p>
                </div>
              </div>
            ))}
          </div>
          {filteredTutorials.length > 6 && (
            <div className="mt-8 flex justify-center">
              <Link
                href="/support/videos"
                id="show-more-videos"
                className="group inline-flex items-center gap-2.5 rounded-full border border-primary/30 bg-primary/5 px-8 py-3.5 text-sm font-semibold text-primary transition-all hover:border-primary hover:bg-primary hover:text-white hover:shadow-[0_12px_32px_-12px_hsl(354_78%_46%/0.4)]"
              >
                <span>{t("support.show_more")}</span>
                <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
              </Link>
            </div>
          )}
        </section>
      )}
    </>
  );
};
