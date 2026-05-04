"use client";

import Link from "next/link";
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin, Twitter } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { ApiStoreSettings } from "@/types/api";
const logo = "/chrani-logo.png";

interface FooterProps {
  settings: ApiStoreSettings | null;
}

export const Footer = ({ settings }: FooterProps) => {
  const { t } = useI18n();
  return (
    <footer className="mt-24 bg-brand-black text-white">
      <div className="container-wide grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-2.5">
            <img src={logo} alt="Chrani" className="h-10 w-10" />
            <span className="font-display text-2xl font-bold">Chrani</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm text-white/60">{t("footer.tagline")}</p>
          <div className="mt-6 flex gap-3">
            {settings?.facebook_url && (
              <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="grid h-9 w-9 place-items-center rounded-full border border-white/15 transition hover:border-primary hover:text-primary">
                <Facebook className="h-4 w-4" />
              </a>
            )}
            {settings?.instagram_url && (
              <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="grid h-9 w-9 place-items-center rounded-full border border-white/15 transition hover:border-primary hover:text-primary">
                <Instagram className="h-4 w-4" />
              </a>
            )}
            {settings?.youtube_url && (
              <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" className="grid h-9 w-9 place-items-center rounded-full border border-white/15 transition hover:border-primary hover:text-primary">
                <Youtube className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-white">
            {t("footer.quickLinks")}
          </h4>
          <ul className="mt-5 space-y-3 text-sm text-white/60">
            <li><Link href="/products" className="hover:text-primary transition">{t("nav.products")}</Link></li>
            <li><Link href="/support" className="hover:text-primary transition">{t("nav.support")}</Link></li>
            <li><Link href="/about" className="hover:text-primary transition">{t("nav.about")}</Link></li>
            <li><Link href="/contact" className="hover:text-primary transition">{t("nav.contact")}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-white">
            {t("footer.contact")}
          </h4>
          <ul className="mt-5 space-y-3 text-sm text-white/60">
            {settings?.phone_numbers?.[0] && (
              <li className="flex items-start gap-2"><Phone className="h-4 w-4 mt-0.5 text-primary" /> {settings.phone_numbers[0]}</li>
            )}
            {settings?.contact_email && (
              <li className="flex items-start gap-2"><Mail className="h-4 w-4 mt-0.5 text-primary" /> {settings.contact_email}</li>
            )}
            {settings?.address && (
              <li className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 text-primary" /> {settings.address['en'] || "Erbil"}</li>
            )}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-white">
            Newsletter
          </h4>
          <p className="mt-5 text-sm text-white/60">Be the first to know about new arrivals.</p>
          <form className="mt-4 flex" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="you@email.com"
              className="min-w-0 flex-1 rounded-l-md bg-white/10 px-3 py-2.5 text-sm placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button className="rounded-r-md bg-primary px-4 text-sm font-medium hover:bg-primary-glow transition">→</button>
          </form>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-wide flex flex-col items-center justify-between gap-2 py-6 text-xs text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} Chrani Catalog. {t("footer.rights")}</p>
          <p>Premium Home Appliances</p>
        </div>
      </div>
    </footer>
  );
};
