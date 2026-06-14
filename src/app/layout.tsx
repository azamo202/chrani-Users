import type { Metadata } from "next";
import { Providers } from "./Providers";
import { getLang } from "@/lib/lang";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CompareFloatingBar } from "@/components/compare/CompareFloatingBar";
import { fetchApi } from "@/lib/api";
import { ApiStoreSettings } from "@/types/api";
import { SITE_URL, CACHE_TTL, COMPANY_DETAILS } from "@/lib/constants";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();

  const companyNames: Record<string, string> = {
    en: "CHRANI COMPANY FOR GENERAL TRADING IMP. & EXP. LTD",
    ar: "شركة چراني للتجارة العامة استيراد و تصدير المحدودة",
    ku: "کۆمپانیای چراني بۆ بازرگانی گشتی و ھاوردە و ھەناردە / سنوردار",
  };

  const defaultTitles: Record<string, string> = {
    en: "Chrani Company | Premium Home Appliances Iraq",
    ar: "شركة چراني (چرانى) | Chrani | الأجهزة المنزلية الممتازة في العراق",
    ku: "کۆمپانیای چرانی (چرانى) | Chrani | ئامێرەکانی ناوماڵ لە عێراق",
  };

  const description: Record<string, string> = {
    en: "Premium home appliances in Iraq. Explore our collection of refrigerators, washing machines, and air conditioners from Chrani (چراني / چرانى), iLK, and iNOX.",
    ar: "أفضل الأجهزة المنزلية في العراق من شركة چراني (چرانى / Chrani). اكتشف مجموعة الثلاجات، الغسالات، والمكيفات من علامات iLK و iNOX.",
    ku: "باشترین ئامێرەکانی ناوماڵ لە عێراق لە کۆمپانیای چرانی (چرانى / Chrani). کۆمەڵەی سەلاجە، غەسالە، و سپلیت لە براندەکانی iLK و iNOX.",
  };

  const keywords: Record<string, string> = {
    en: "Chrani, Chrani Company, چراني, چرانى, home appliances Iraq, refrigerators, washing machines, air conditioners, iLK appliances, iNOX brands",
    ar: "چراني, چرانى, Chrani, شركة چراني, شركة چرانى, اجهزة منزلية العراق، ثلاجات، غسالات، مكيفات، ماركة iLK، علامة iNOX، اجهزة كهربائية دهوك",
    ku: "چراني, چرانى, چرانی, Chrani, کۆمپانیای چراني, کۆمپانیای چرانی, ئامێرەکانی ناوماڵ، سەلاجە، غەسالە، سپلیت، براندی iLK, براندی iNOX",
  };

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      template: `%s | ${companyNames[lang]}`,
      default: defaultTitles[lang] ?? defaultTitles.en,
    },
    description: description[lang] ?? description.en,
    keywords: keywords[lang] ?? keywords.en,
    alternates: {
      canonical: "/",
      languages: {
        "en-US": "/?lang=en",
        "ar-IQ": "/?lang=ar",
        "ku-IQ": "/?lang=ku",
      },
    },
    openGraph: {
      title: defaultTitles[lang] ?? defaultTitles.en,
      description: description[lang] ?? description.en,
      url: SITE_URL,
      siteName: "Chrani Catalog",
      locale: lang === "ar" ? "ar_IQ" : lang === "ku" ? "ku_IQ" : "en_US",
      type: "website",
      images: [
        {
          url: `${SITE_URL}/chrani-logo.png`,
          width: 800,
          height: 800,
          alt: companyNames[lang] ?? companyNames.en,
        },
      ],
    },
    twitter: {
      card: "summary",
      title: defaultTitles[lang] ?? defaultTitles.en,
      description: description[lang] ?? description.en,
      images: [`${SITE_URL}/chrani-logo.png`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const lang = await getLang();
  const dir = lang === "ar" || lang === "ku" ? "rtl" : "ltr";

  // Fetch store settings — failures are non-fatal (graceful degradation).
  let storeSettings: ApiStoreSettings | null = null;
  try {
    const res = await fetchApi<{ settings: ApiStoreSettings }>("/api/site/store-settings", {
      next: { revalidate: CACHE_TTL.storeSettings, tags: ["store-settings"] },
    });
    storeSettings = res?.settings ?? null;
  } catch (error) {
    // Log but don't crash — layout still renders without settings.
    console.error("[RootLayout] Failed to fetch store settings:", error);
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: COMPANY_DETAILS.name,
    alternateName: [
      "شركة چراني",
      "شركة چرانى",
      "کۆمپانیای چرانی",
      "Chrani",
      "چراني",
      "چرانى",
      "Chrani Company",
    ],
    url: SITE_URL,
    logo: `${SITE_URL}${COMPANY_DETAILS.logo}`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: storeSettings?.phone ?? "+9647504454864",
      contactType: "customer service",
      areaServed: "IQ",
      availableLanguage: ["Arabic", "Kurdish", "English"],
    },
    sameAs: [COMPANY_DETAILS.facebook, COMPANY_DETAILS.instagram],
  };

  return (
    <html lang={lang} dir={dir} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans">
        <Providers locale={lang}>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1" id="main-content">
              {children}
            </main>
            <Footer settings={storeSettings} />
            <CompareFloatingBar />
          </div>
        </Providers>
      </body>
    </html>
  );
}
