import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Providers } from "./Providers";
import { cookies } from "next/headers";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

// We maintain the same font classes the user had in tailwind config if needed, 
// or simply let Tailwind handle it since we will just import global CSS.

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("chrani-lang")?.value || "en") as "en" | "ar" | "ku";

  const companyNames = {
    en: "CHRANI COMPANY FOR GENERAL TRADING IMP. & EXP. LTD",
    ar: "شركة چراني للتجارة العامة استيراد و تصدير المحدودة",
    ku: "کۆمپانیای چرانی بۆ بازرگانی گشتی و ھاوردە و ھەناردە / سنوردار",
  };

  return {
    title: companyNames[lang] || companyNames.en,
    description: "Product catalog",
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("chrani-lang")?.value || "en") as "en" | "ar" | "ku";
  const dir = lang === "ar" || lang === "ku" ? "rtl" : "ltr";

  return (
    <html lang={lang} dir={dir} suppressHydrationWarning>
      <body>
        <Providers locale={lang}>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
