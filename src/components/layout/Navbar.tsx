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
      <div className="container-wide flex h-16 items-center justify-between lg:h-20 lg:gap-4">
        {/* Logo Section (Desktop: Start, Mobile: Far Right/Start) */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Chrani Catalog">
            <img src={logo} alt="Chrani" className="h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10" />
            <div className="flex flex-col text-start leading-none">
              {/* Desktop View: Original Full Name */}
              <span className="hidden lg:block font-display text-base font-bold tracking-tight xl:text-lg">
                {t("logo.full_name")}
              </span>
              
              {/* Mobile View: Professional Split Name */}
              <div className="lg:hidden flex flex-col">
                <span className="font-display text-[14px] font-bold tracking-tight text-foreground sm:text-[16px]">
                  {t("logo.name")}
                </span>
                <span className="mt-1 text-[10px] font-medium text-muted-foreground leading-tight max-w-[200px] sm:max-w-[240px] whitespace-normal">
                  {t("logo.subtitle")}
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Desktop Nav (Center) */}
        <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex">
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

        {/* Right Side (Desktop: Lang, Mobile: Lang + Hamburger) */}
        <div className="flex items-center gap-2">
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

          <button
            type="button"
            className="rounded-md p-2 -me-2 lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
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
