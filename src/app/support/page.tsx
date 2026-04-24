"use client";

import { FileText, Download, MapPin, Phone, Clock } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { manuals, tutorials, serviceCenters } from "@/data/catalog";

const Support = () => {
  const { t } = useI18n();
  return (
    <>
      <section className="border-b border-border/60 bg-muted/30">
        <div className="container-wide py-12 lg:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Support</p>
          <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">{t("support.title")}</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">{t("support.subtitle")}</p>
        </div>
      </section>

      {/* Manuals */}
      <section className="container-wide py-16">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">{t("support.downloads")}</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {manuals.map((m) => (
            <a
              key={m.id}
              href={m.url}
              className="group flex items-center gap-4 rounded-xl border border-border bg-card p-5 transition hover:border-primary/40 hover:shadow-card"
            >
              <div className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                <FileText className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{m.title}</p>
                <p className="text-xs text-muted-foreground">PDF · {m.size}</p>
              </div>
              <Download className="h-5 w-5 text-muted-foreground transition group-hover:text-primary" />
            </a>
          ))}
        </div>
      </section>

      {/* Videos */}
      <section className="bg-muted/40 py-16">
        <div className="container-wide">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">{t("support.videos")}</h2>
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {tutorials.map((v) => (
              <div key={v.id} className="overflow-hidden rounded-xl border border-border bg-card">
                <div className="aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${v.youtubeId}`}
                    title={v.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full"
                  />
                </div>
                <div className="p-5">
                  <p className="font-medium">{v.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Centers */}
      <section className="container-wide py-16">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">{t("support.centers")}</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {serviceCenters.map((c) => (
            <div key={c.city} className="rounded-xl border border-border bg-card p-6 transition hover:shadow-card">
              <h3 className="font-display text-xl font-bold">{c.city}</h3>
              <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
                <li className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  <span>{c.address}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  <a href={`tel:${c.phone.replace(/\s/g, "")}`} className="hover:text-primary">{c.phone}</a>
                </li>
                <li className="flex items-start gap-2.5">
                  <Clock className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  <span>{c.hours}</span>
                </li>
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Support;
