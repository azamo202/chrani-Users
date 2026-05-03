"use client";

import { Phone, MapPin, Facebook, Instagram, Youtube, Send } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { useState } from "react";
import { toast } from "sonner";

const Contact = () => {
  const { t } = useI18n();
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(t("contact.form.success"));
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <>
      <section className="border-b border-border/60 bg-muted/30">
        <div className="container-wide py-12 lg:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">{t("nav.contact")}</p>
          <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">{t("contact.title")}</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">{t("contact.subtitle")}</p>
        </div>
      </section>

      <section className="container-wide grid gap-12 py-16 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-6">
          {[
            { icon: Phone, label: t("contact.phone"), value: "009647504454864", href: "tel:009647504454864" },
            { icon: MapPin, label: t("contact.address"), value: t("contact.address.value"), href: "https://maps.app.goo.gl/JYvsYCgmY46uafK46" },
          ].map((c) => (
            <div key={c.label} className="flex items-start gap-4 rounded-xl border border-border bg-card p-5">
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary">
                <c.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{c.label}</p>
                {c.href ? (
                  <a 
                    href={c.href} 
                    target={c.href.startsWith("http") ? "_blank" : undefined}
                    rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="mt-1 block font-medium hover:text-primary"
                  >
                    {c.value}
                  </a>
                ) : (
                  <p className="mt-1 font-medium">{c.value}</p>
                )}
              </div>
            </div>
          ))}

          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">{t("contact.social")}</p>
            <div className="mt-3 flex gap-3">
              {[Facebook, Instagram, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="grid h-10 w-10 place-items-center rounded-full border border-border transition hover:border-primary hover:text-primary"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <form onSubmit={onSubmit} className="rounded-2xl border border-border bg-card p-8">
          <h3 className="font-display text-2xl font-bold">{t("contact.form.title")}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{t("contact.form.subtitle")}</p>

          <div className="mt-6 space-y-4">
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder={t("contact.form.name")}
              className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder={t("contact.form.email")}
              className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <textarea
              required
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder={t("contact.form.message")}
              className="w-full resize-none rounded-md border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-glow">
              <Send className="h-4 w-4 rtl:rotate-180" /> {t("contact.form.submit")}
            </button>
          </div>
        </form>
      </section>

      {/* Map */}
      <section className="container-wide pb-20">
        <div className="overflow-hidden rounded-2xl border border-border">
          <iframe
            title="Chrani location"
            src="https://maps.google.com/maps?q=Sendore+Way+Road,+Duhok,+Iraq&t=&z=15&ie=UTF8&iwloc=&output=embed"
            className="h-[420px] w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </>
  );
};

export default Contact;
