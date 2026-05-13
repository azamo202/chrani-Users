"use client";

import { useState } from "react";
import Link from "next/link";
import { NavLink } from "@/components/NavLink";
import { Menu, X, Globe, Check } from "lucide-react";
import { useI18n, Lang } from "@/i18n/I18nProvider";
const logo = "/chrani-logo.png";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const langOptions: { code: Lang; label: string; native: string }[] = [
  { code: "en", label: "English", native: "English" },
  { code: "ar", label: "Arabic", native: "العربية" },
  { code: "ku", label: "Kurdish", native: "کوردی" },
];

export const Navbar = () => {
  const { t, lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);

  const links = [
    { to: "/", label: t("nav.home") },
    { to: "/products", label: t("nav.products") },
    { to: "/about", label: t("nav.about") },
    { to: "/support", label: t("nav.support") },
    { to: "/contact", label: t("nav.contact") },
  ];

  const currentLang = langOptions.find((l) => l.code === lang)!;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur-lg">
      <div className="container-wide grid h-16 grid-cols-3 items-center lg:flex lg:h-20 lg:justify-between lg:gap-4">
        {/* Mobile Hamburger (Start) */}
        <div className="flex justify-start lg:hidden">
          <button
            type="button"
            className="rounded-md p-2 -ms-2"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Logo (Center on mobile, Start on Desktop) */}
        <div className="flex justify-center lg:justify-start">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Chrani Catalog">
            <img src={logo} alt="Chrani" className="h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10" />
            <div className="flex flex-col leading-none text-start">
              <span className="hidden lg:block font-display text-base font-bold tracking-tight xl:text-lg">
                {t("logo.full_name")}
              </span>
              <span className="lg:hidden font-display text-lg font-bold tracking-tight sm:text-xl">
                {t("logo.name")}
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                cn(
                  "relative px-4 py-2 text-sm font-medium transition-colors hover:text-primary",
                  isActive ? "text-primary" : "text-foreground/70"
                )
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  {isActive && (
                    <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-primary" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Lang Switcher (End) */}
        <div className="flex justify-end items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1.5 rounded-full border border-border/60 px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium hover:border-primary/40 hover:text-primary transition-colors">
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">{currentLang.native}</span>
              <span className="sm:hidden">{currentLang.code.toUpperCase()}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {langOptions.map((opt) => (
                <DropdownMenuItem key={opt.code} onClick={() => setLang(opt.code)} className="cursor-pointer">
                  <span className="flex-1 text-start">{opt.native}</span>
                  {lang === opt.code && <Check className="ms-4 h-4 w-4 text-primary" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-background lg:hidden">
          <nav className="container-wide flex flex-col py-3">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "rounded-md px-3 py-3 text-base font-medium transition-colors",
                    isActive ? "bg-primary/5 text-primary" : "text-foreground/80 hover:bg-muted"
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};
