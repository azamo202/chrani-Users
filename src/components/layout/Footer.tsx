"use client";

import Link from "next/link";
import {
  Facebook,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Twitter,
} from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { ApiStoreSettings } from "@/types/api";
const logo = "/chrani-logo.png";

interface FooterProps {
  settings: ApiStoreSettings | null;
}

const TiktokIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const WhatsappIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    <path d="M16.5 13.5l-2.5-1.5-1.5 1.5a4.5 4.5 0 0 1-4.5-4.5l1.5-1.5-1.5-2.5-2 .5c-.5 1.5.5 3.5 2.5 5.5s4 3 5.5 2.5l.5-2z" />
  </svg>
);

export const Footer = ({ settings }: FooterProps) => {
  const { t } = useI18n();

  const cleanWhatsappNumber = settings?.whatsapp?.replace(/[^0-9]/g, "");

  return (
    <footer className="mt-24 bg-brand-black text-white">
      <div className="container-wide grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-3">
        <div>
          <Link href="/" className="flex items-center gap-2.5">
            <img src={logo} alt="Chrani" className="h-10 w-10" />
            <span className="font-display text-2xl font-bold">Chrani</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm text-white/60">
            {t("footer.tagline")}
          </p>
          <div className="mt-6 flex gap-3">
            {settings?.facebook && (
              <a
                href={settings.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="grid h-9 w-9 place-items-center rounded-full border border-white/15 transition hover:border-primary hover:text-primary"
              >
                <Facebook className="h-4 w-4" />
              </a>
            )}
            {settings?.instagram && (
              <a
                href={settings.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="grid h-9 w-9 place-items-center rounded-full border border-white/15 transition hover:border-primary hover:text-primary"
              >
                <Instagram className="h-4 w-4" />
              </a>
            )}
            {settings?.youtube && (
              <a
                href={settings.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="grid h-9 w-9 place-items-center rounded-full border border-white/15 transition hover:border-primary hover:text-primary"
              >
                <Youtube className="h-4 w-4" />
              </a>
            )}
            {settings?.tiktok && (
              <a
                href={settings.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="grid h-9 w-9 place-items-center rounded-full border border-white/15 transition hover:border-primary hover:text-primary"
              >
                <TiktokIcon className="h-4 w-4" />
              </a>
            )}
            {cleanWhatsappNumber && (
              <a
                href={`https://wa.me/${cleanWhatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="grid h-9 w-9 place-items-center rounded-full border border-white/15 transition hover:border-primary hover:text-primary"
              >
                <WhatsappIcon className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-white">
            {t("footer.quickLinks")}
          </h4>
          <ul className="mt-5 space-y-3 text-sm text-white/60">
            <li>
              <Link href="/products" className="hover:text-primary transition">
                {t("nav.products")}
              </Link>
            </li>
            <li>
              <Link href="/support" className="hover:text-primary transition">
                {t("nav.support")}
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-primary transition">
                {t("nav.about")}
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-primary transition">
                {t("nav.contact")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-white">
            {t("footer.contact")}
          </h4>
          <ul className="mt-5 space-y-3 text-sm text-white/60">
            {(Array.isArray(settings?.phone) ? settings?.phone : [settings?.phone]).filter(Boolean).map((num, i) => (
              <li key={`phone-${i}`} className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                <a
                  href={`tel:${num.replace(/\s/g, "")}`}
                  className="hover:text-primary transition text-start"
                  dir="ltr"
                >
                  {num}
                </a>
              </li>
            ))}
            {settings?.address && (
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-primary" />{" "}
                {settings.address["en"] || "Erbil"}
              </li>
            )}
          </ul>
        </div>

        {/* Newsletter Section - Hidden for now */}
        {false && (
          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-white">
              {t("newslitter.title")}
            </h4>
            <p className="mt-5 text-sm text-white/60">
              {t("newslitter.subtitle")}
            </p>
            <form className="mt-4 flex" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder={t("newslitter.placeholder")}
                className="min-w-0 flex-1 rounded-l-md bg-white/10 px-3 py-2.5 text-sm placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button className="rounded-r-md bg-primary px-4 text-sm font-medium hover:bg-primary-glow transition">
                →
              </button>
            </form>
          </div>
        )}
      </div>
      <div className="border-t border-white/10">
        <div className="container-wide flex flex-col items-center justify-between gap-2 py-6 text-xs text-white/50 sm:flex-row">
          <p>
            {t("footer.rights")}
          </p>
          <p>Premium Home Appliances</p>
        </div>
      </div>
    </footer>
  );
};
