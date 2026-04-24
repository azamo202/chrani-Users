"use client";

import { Award, Target, Eye } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

const About = () => {
  const { t } = useI18n();
  return (
    <>
      <section className="relative overflow-hidden bg-brand-black text-white">
        <div className="container-wide py-20 lg:py-28">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">{t("nav.about")}</p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            {t("about.title")}
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-white/70">{t("about.subtitle")}</p>
        </div>
      </section>

      <section className="container-wide grid gap-12 py-16 lg:grid-cols-2 lg:py-24">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">{t("about.history")}</p>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">{t("about.history.title")}</h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
            <p>
              {t("about.history.p1")}
            </p>
            <p>
              {t("about.history.p2")}
            </p>
            <p>
              {t("about.history.p3")}
            </p>
          </div>
        </div>
        <div className="relative">
          <img
            src="/3.webp"
            alt="Chrani craftsmanship"
            className="aspect-[4/5] w-full rounded-2xl object-cover shadow-elegant"
          />
        </div>
      </section>

      <section className="bg-muted/40 py-16 lg:py-24">
        <div className="container-wide grid gap-6 md:grid-cols-3">
          {[
            { icon: Eye, title: t("about.vision"), body: t("about.vision.body") },
            { icon: Target, title: t("about.mission"), body: t("about.mission.body") },
            { icon: Award, title: t("about.values"), body: t("about.values.body") },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-border bg-card p-8">
              <div className="grid h-12 w-12 place-items-center rounded-lg bg-primary/10 text-primary">
                <item.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-xl font-bold">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-wide py-16 lg:py-24">
        <div className="grid gap-8 sm:grid-cols-3">
          {[
            { n: t("about.stats.years.n"), l: t("about.stats.years.l") },
            { n: t("about.stats.homes.n"), l: t("about.stats.homes.l") },
            { n: t("about.stats.satisfaction.n"), l: t("about.stats.satisfaction.l") },
          ].map((s) => (
            <div key={s.l} className="border-t-2 border-primary pt-6">
              <p className="font-display text-5xl font-bold">{s.n}</p>
              <p className="mt-2 text-sm uppercase tracking-wider text-muted-foreground">{s.l}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default About;
