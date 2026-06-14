"use client";

import Link from "next/link";
import {
  Facebook,
  Instagram,
  Youtube,
  Phone,
  MapPin,
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
    aria-hidden="true"
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
    aria-hidden="true"
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    <path d="M16.5 13.5l-2.5-1.5-1.5 1.5a4.5 4.5 0 0 1-4.5-4.5l1.5-1.5-1.5-2.5-2 .5c-.5 1.5.5 3.5 2.5 5.5s4 3 5.5 2.5l.5-2z" />
  </svg>
);

export const Footer = ({ settings }: FooterProps) => {
  const { t, lang } = useI18n();

  const cleanWhatsappNumber = settings?.whatsapp?.replace(/\D/g, "");

  // Build social links list — only include if href is defined
  const socialLinks = [
    settings?.facebook && {
      href: settings.facebook,
      Icon: Facebook,
      label: "Facebook",
    },
    settings?.instagram && {
      href: settings.instagram,
      Icon: Instagram,
      label: "Instagram",
    },
    settings?.youtube && {
      href: settings.youtube,
      Icon: Youtube,
      label: "YouTube",
    },
    settings?.tiktok && {
      href: settings.tiktok,
      Icon: TiktokIcon,
      label: "TikTok",
    },
    cleanWhatsappNumber && {
      href: `https://wa.me/${cleanWhatsappNumber}`,
      Icon: WhatsappIcon,
      label: "WhatsApp",
    },
  ].filter(Boolean) as {
    href: string;
    Icon: React.ComponentType<{ className?: string }>;
    label: string;
  }[];

  // Normalise phone to an array
  const phoneNumbers = Array.isArray(settings?.phone)
    ? settings.phone.filter(Boolean)
    : settings?.phone
    ? [settings.phone]
    : [];

  return (
    <footer className="mt-24 bg-brand-black text-white" role="contentinfo">
      <div className="container-wide grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-3">
        {/* Brand */}
        <div>
          <Link href="/" className="flex items-center gap-2.5" aria-label="Chrani Company — Home">
            <img src={logo} alt="" className="h-10 w-10" aria-hidden="true" />
            <span className="font-display text-2xl font-bold">{t("logo.name")}</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm text-white/60">
            {t("footer.tagline")}
          </p>
          {socialLinks.length > 0 && (
            <div className="mt-6 flex gap-3" aria-label="Social media links">
              {socialLinks.map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/15 transition hover:border-primary hover:text-primary"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Quick links */}
        <nav aria-label="Footer navigation">
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-white">
            {t("footer.quickLinks")}
          </h4>
          <ul className="mt-5 space-y-3 text-sm text-white/60">
            {[
              { href: "/products", label: t("nav.products") },
              { href: "/support", label: t("nav.support") },
              { href: "/about", label: t("nav.about") },
              { href: "/contact", label: t("nav.contact") },
            ].map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-primary transition">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact info */}
        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-white">
            {t("footer.contact")}
          </h4>
          <ul className="mt-5 space-y-3 text-sm text-white/60">
            {phoneNumbers.map((num, i) => (
              <li key={`phone-${i}`} className="flex items-start gap-2">
                <Phone
                  className="h-4 w-4 mt-0.5 text-primary flex-shrink-0"
                  aria-hidden="true"
                />
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
                <MapPin
                  className="h-4 w-4 mt-0.5 text-primary flex-shrink-0"
                  aria-hidden="true"
                />
                <span>
                  {settings.address[lang] ?? settings.address.en ?? "Erbil, Iraq"}
                </span>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-wide flex flex-col items-center justify-between gap-2 py-6 text-xs text-white/50 sm:flex-row">
          <p>{t("footer.rights")}</p>
          <p>Premium Home Appliances</p>
        </div>
      </div>
    </footer>
  );
};
