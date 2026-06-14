"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { NavLink } from "@/components/NavLink";
import { Menu, X, Globe, Check } from "lucide-react";
import { useI18n, Lang } from "@/i18n/I18nProvider";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const logo = "/chrani-logo.png";

const langOptions: { code: Lang; label: string; native: string }[] = [
  { code: "en", label: "English", native: "English" },
  { code: "ar", label: "Arabic", native: "العربية" },
  { code: "ku", label: "Kurdish", native: "کوردی" },
];

export const Navbar = () => {
  const { t, lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const links = [
    { to: "/", label: t("nav.home") },
    { to: "/products", label: t("nav.products") },
    { to: "/about", label: t("nav.about") },
    { to: "/support", label: t("nav.support") },
    { to: "/contact", label: t("nav.contact") },
  ];

  const currentLang = langOptions.find((l) => l.code === lang) ?? langOptions[0];

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur-lg"
      role="banner"
    >
      {/* Skip to main content (accessibility) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
      >
        Skip to main content
      </a>

      <div className="container-wide flex h-16 items-center justify-between lg:h-20 lg:gap-4">
        {/* Logo */}
        <div className="flex items-center">
          <Link
            href="/"
            className="flex items-center gap-2.5"
            aria-label="Chrani Company — Home"
          >
            <img
              src={logo}
              alt="Chrani"
              className="h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10"
              width={40}
              height={40}
            />
            <div className="flex flex-col text-start leading-none">
              {/* Desktop */}
              <span className="hidden lg:block font-display text-base font-bold tracking-tight xl:text-lg">
                {t("logo.full_name")}
              </span>
              {/* Mobile */}
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

        {/* Desktop Navigation */}
        <nav
          className="hidden flex-1 items-center justify-center gap-1 lg:flex"
          aria-label="Main navigation"
        >
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
                    <span
                      className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-primary"
                      aria-hidden="true"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Right side: Language + Hamburger */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger
              className="flex items-center gap-1.5 rounded-full border border-border/60 px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium hover:border-primary/40 hover:text-primary transition-colors"
              aria-label="Select language"
            >
              <Globe className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">{currentLang.native}</span>
              <span className="sm:hidden">{currentLang.code.toUpperCase()}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {langOptions.map((opt) => (
                <DropdownMenuItem
                  key={opt.code}
                  onClick={() => setLang(opt.code)}
                  className="cursor-pointer"
                  role="menuitemradio"
                  aria-checked={lang === opt.code}
                >
                  <span className="flex-1 text-start">{opt.native}</span>
                  {lang === opt.code && (
                    <Check className="ms-4 h-4 w-4 text-primary" aria-hidden="true" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <button
            type="button"
            className="rounded-md p-2 -me-2 lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            {open ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {open && (
        <div
          id="mobile-nav"
          className="border-t border-border/60 bg-background lg:hidden"
        >
          <nav
            className="container-wide flex flex-col py-3"
            aria-label="Mobile navigation"
          >
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "rounded-md px-3 py-3 text-base font-medium transition-colors",
                    isActive
                      ? "bg-primary/5 text-primary"
                      : "text-foreground/80 hover:bg-muted"
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
