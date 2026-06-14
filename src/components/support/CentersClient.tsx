"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { MapPin, Clock, Search, Map, ArrowRight, ArrowLeft, ChevronDown } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { ApiMaintenanceCenter } from "@/types/api";
import { PhoneNumbersDisplay } from "@/components/PhoneNumbersDisplay";

interface CentersClientProps {
  serviceCenters: ApiMaintenanceCenter[];
}

export const CentersClient = ({ serviceCenters }: CentersClientProps) => {
  const { t, lang, dir } = useI18n();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const BackArrow = dir === "rtl" ? ArrowRight : ArrowLeft;

  // Extract unique cities for the filter
  const cities = useMemo(() => {
    const cityKeys: Record<string, string> = {};
    serviceCenters.forEach((c) => {
      const cityKey = c.city?.en || c.city?.ar || "";
      const cityLabel = c.city?.[lang] || c.city?.en || "";
      if (cityKey && !cityKeys[cityKey]) {
        cityKeys[cityKey] = cityLabel;
      }
    });
    return Object.entries(cityKeys).map(([key, label]) => ({ key, label }));
  }, [serviceCenters, lang]);

  // Filter service centers
  const filtered = useMemo(() => {
    return serviceCenters.filter((c) => {
      // City filter
      if (selectedCity) {
        const cityKey = c.city?.en || c.city?.ar || "";
        if (cityKey !== selectedCity) return false;
      }

      // Search filter
      if (searchTerm) {
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
      }

      return true;
    });
  }, [serviceCenters, searchTerm, selectedCity]);

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

          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">{t("support.centers")}</p>
          <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl lg:text-5xl">{t("support.centers.title")}</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">{t("support.centers.subtitle")}</p>

          {/* Filters */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground rtl:left-auto rtl:right-4" />
              <input
                type="text"
                id="centers-search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t("support.search")}
                className="w-full rounded-full border border-border/60 bg-background py-3.5 pl-12 pr-6 shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary rtl:pl-6 rtl:pr-12"
              />
            </div>

            {cities.length > 1 && (
              <div className="relative w-full sm:w-auto">
                <select
                  id="centers-city-filter"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full sm:w-auto sm:min-w-[200px] appearance-none rounded-full border border-border/60 bg-background py-3.5 pl-5 pr-12 text-sm font-medium shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary rtl:pl-12 rtl:pr-5"
                >
                  <option value="">{t("support.filter.all")} — {t("support.filter.city")}</option>
                  {cities.map((city) => (
                    <option key={city.key} value={city.key}>
                      {city.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground rtl:left-4 rtl:right-auto" />
              </div>
            )}

            <span className="text-sm text-muted-foreground">
              {filtered.length} {t("support.items_count")}
            </span>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="container-wide py-16">
        {filtered.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2">
            {filtered.map((c, index) => (
              <div
                key={c.id}
                className="rounded-xl border border-border bg-card p-6 transition hover:shadow-card"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-xl font-bold break-words whitespace-normal">
                      {c.name?.[lang] || c.name?.["en"] || c.city[lang] || c.city["en"]}
                    </h3>
                    <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-0.5 text-sm font-bold text-primary">
                      <Map className="h-3.5 w-3.5" />
                      <span>{c.city[lang] || c.city["en"]}</span>
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
                    <span>{c.address[lang] || c.address["en"]}</span>
                  </li>
                  <li className="pt-2">
                    <PhoneNumbersDisplay phone={c.phone} />
                  </li>
                  {c.working_hours && (
                    <li className="flex items-start gap-2.5">
                      <Clock className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                      <span>{c.working_hours[lang] || c.working_hours["en"]}</span>
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-muted">
              <MapPin className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="mt-4 text-lg font-medium text-muted-foreground">{t("support.no_results")}</p>
          </div>
        )}
      </section>
    </>
  );
};
