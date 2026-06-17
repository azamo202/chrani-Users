"use client";

import { Phone, MapPin, Facebook, Instagram, Youtube, Send, MessageCircle } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { fetchApi } from "@/lib/api";
import { ApiStoreSettings } from "@/types/api";
import { PhoneNumbersDisplay } from "@/components/PhoneNumbersDisplay";

const TiktokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const Contact = () => {
  const { t, lang } = useI18n();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [settings, setSettings] = useState<ApiStoreSettings | null>(null);

  useEffect(() => {
    fetchApi<any>("/api/site/store-settings").then((res) => {
      if (res && res.settings) {
        setSettings(res.settings);
      } else {
        setSettings(res);
      }
    }).catch(err => console.error("Failed to fetch settings", err));
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (form.message.trim().length < 10) {
      toast.error(
        lang === "ar" ? "يجب أن لا تقل الرسالة عن 10 أحرف" : 
        lang === "ku" ? "پێویستە نامەکە لە ١٠ پیت کەمتر نەبێت" : 
        "Message must be at least 10 characters"
      );
      return;
    }

    setIsSubmitting(true);
    try {
      await fetchApi("/api/site/contact", {
        method: "POST",
        body: JSON.stringify(form),
      });
      toast.success(t("contact.form.success"));
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      toast.error(t("common.error") || "Failed to send message");
    } finally {
      setIsSubmitting(false);
    }
  };

  const socialLinks = [
    { icon: Facebook, href: settings?.facebook },
    { icon: Instagram, href: settings?.instagram },
    { icon: Youtube, href: settings?.youtube },
    { icon: TiktokIcon, href: settings?.tiktok },
    { icon: MessageCircle, href: settings?.whatsapp ? `https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}` : null },
  ].filter(s => s.href);

  return (
    <>
      <section className="border-b border-border/60 bg-muted/30">
        <div className="container-wide py-12 lg:py-16">
          <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">{t("contact.title")}</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">{t("contact.subtitle")}</p>
        </div>
      </section>

      <section className="container-wide grid gap-12 py-16 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-6">
          {[
            { 
              icon: Phone, 
              label: t("contact.phone"), 
              content: <PhoneNumbersDisplay phone={settings?.phone || "009647504454864"} className="mt-2" />
            },
            { 
              icon: MapPin, 
              label: t("contact.address"), 
              content: (
                <a 
                  href="https://maps.app.goo.gl/HZ7o3eedDS4vdPSRA" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 block font-medium hover:text-primary"
                >
                  {settings?.address?.[lang] || settings?.address?.en || t("contact.address.value")}
                </a>
              )
            },
          ].map((c) => (
            <div key={c.label} className="flex items-start gap-4 rounded-xl border border-border bg-card p-5 overflow-hidden">
              <div className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                <c.icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{c.label}</p>
                {c.content}
              </div>
            </div>
          ))}

          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">{t("contact.social")}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {socialLinks.map((social, i) => (
                <a
                  key={i}
                  href={social.href!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid h-11 w-11 place-items-center rounded-full border border-border transition hover:border-primary hover:text-primary hover:bg-primary/5"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
              {socialLinks.length === 0 && (
                 <p className="text-sm text-muted-foreground">No social links available.</p>
              )}
            </div>
          </div>
        </div>

        <form onSubmit={onSubmit} className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <h3 className="font-display text-2xl font-bold">{t("contact.form.title")}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{t("contact.form.subtitle")}</p>

          <div className="mt-6 space-y-4">
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder={t("contact.form.name")}
              className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder={t("contact.form.email")}
              className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
            <textarea
              required
              minLength={10}
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder={t("contact.form.message")}
              className="w-full resize-none rounded-md border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
            <button 
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:bg-primary-glow hover:shadow-primary/40 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4 rtl:rotate-180" /> 
              {isSubmitting ? t("common.sending") || "Sending..." : t("contact.form.submit")}
            </button>
          </div>
        </form>
      </section>

      {/* Map */}
      <section className="container-wide pb-20">
        <div className="overflow-hidden rounded-2xl border border-border shadow-sm">
          <iframe
            title="Chrani location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3191.993692548742!2d43.00353909999999!3d36.8665698!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40088db18ae1c0f1%3A0x900b9ea00b75579c!2sChrani%20Company!5e0!3m2!1sen!2s!4v1778252192920!5m2!1sen!2s"
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
