import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Providers } from "./Providers";
import { cookies } from "next/headers";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CompareFloatingBar } from "@/components/compare/CompareFloatingBar";
import { fetchApi } from "@/lib/api";
import { ApiStoreSettings } from "@/types/api";
import { Suspense } from "react";
import { SITE_URL } from "@/lib/constants";

// We maintain the same font classes the user had in tailwind config if needed,
// or simply let Tailwind handle it since we will just import global CSS.

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("chrani-lang")?.value || "en") as
    | "en"
    | "ar"
    | "ku";

  const companyNames = {
    en: "CHRANI COMPANY FOR GENERAL TRADING IMP. & EXP. LTD",
    ar: "شركة چراني للتجارة العامة استيراد و تصدير المحدودة",
    ku: "کۆمپانیای چرانی بۆ بازرگانی گشتی و ھاوردە و ھەناردە / سنوردار",
  };

  const description = {
    en: "Premium home appliances in Iraq. Explore our collection of refrigerators, washing machines, and air conditioners from Chrani, iLK, and iNOX.",
    ar: "أفضل الأجهزة المنزلية في العراق. اكتشف مجموعة الثلاجات، الغسالات، والمكيفات من شركة چراني وعلامات iLK و iNOX.",
    ku: "باشترین ئامێرەکانی ناوماڵ لە عێراق. کۆمەڵەی سەلاجە، غەسالە، و سپلیت لە کۆمپانیای چرانی و براندەکانی iLK و iNOX.",
  };

  const keywords = {
    en: "home appliances Iraq, refrigerators, washing machines, air conditioners, Chrani company, iLK appliances, iNOX brands",
    ar: "اجهزة منزلية العراق، ثلاجات، غسالات، مكيفات، شركة چراني، ماركة iLK، علامة iNOX، اجهزة كهربائية دهوك",
    ku: "ئامێرەکانی ناوماڵ، سەلاجە، غەسالە، سپلیت، کۆمپانیای چرانی، براندی iLK، براندی iNOX",
  };

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      template: `%s | ${companyNames[lang]}`,
      default: companyNames[lang],
    },
    description: description[lang],
    keywords: keywords[lang],
    alternates: {
      canonical: "/",
      languages: {
        "en-US": "/?lang=en",
        "ar-IQ": "/?lang=ar",
        "ku-IQ": "/?lang=ku",
      },
    },
    openGraph: {
      title: companyNames[lang],
      description: description[lang],
      url: SITE_URL,
      siteName: "Chrani Catalog",
      locale: lang === "ar" ? "ar_IQ" : lang === "ku" ? "ku_IQ" : "en_US",
      type: "website",
      images: [
        {
          url: "/chrani-logo.png",
          width: 800,
          height: 800,
          alt: companyNames[lang],
        },
      ],
    },
    twitter: {
      card: "summary",
      title: companyNames[lang],
      description: description[lang],
      images: ["/chrani-logo.png"],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("chrani-lang")?.value || "en") as
    | "en"
    | "ar"
    | "ku";
  const dir = lang === "ar" || lang === "ku" ? "rtl" : "ltr";

  let storeSettings: ApiStoreSettings | null = null;
  try {
    const res = await fetchApi<any>("/api/site/store-settings", {
      next: { revalidate: 3600 },
    });

    storeSettings = res.settings;
  } catch (error) {
    console.error("Failed to fetch store settings:", error);
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Chrani Company",
    "alternateName": "شركة چراني",
    "url": SITE_URL,
    "logo": `${SITE_URL}/chrani-logo.png`,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": storeSettings?.phone || "+9647504454864",
      "contactType": "customer service",
      "areaServed": "IQ",
      "availableLanguage": ["Arabic", "Kurdish", "English"]
    },
    "sameAs": [
      "https://facebook.com/chranicompany",
      "https://instagram.com/chranicompany"
    ]
  };

  return (
    <html lang={lang} dir={dir} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Providers locale={lang}>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer settings={storeSettings} />
            <CompareFloatingBar />
          </div>
        </Providers>
      </body>
    </html>
  );
}
