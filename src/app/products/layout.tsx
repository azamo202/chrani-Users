import { Metadata } from "next";
import { cookies } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const lang = cookieStore.get("chrani-lang")?.value || "en";

  const titles = {
    en: "Product Catalog | Refrigerators, Washing Machines & More",
    ar: "كتالوج المنتجات | ثلاجات، غسالات، وأكثر",
    ku: "کاتالۆگی بەرهەمەکان | سەلاجە، غەسالە، و زیاتر",
  };

  const descriptions = {
    en: "Browse our wide range of premium home appliances. High-quality refrigerators, washing machines, and air conditioners in Iraq.",
    ar: "تصفح مجموعتنا الواسعة من الأجهزة المنزلية الفاخرة. ثلاجات، غسالات، ومكيفات عالية الجودة في العراق.",
    ku: "بینەری کۆمەڵە ناوازەکانمان بە لە ئامێرەکانی ناوماڵ. سەلاجە، غەسالە، و سپلیتی کوالێتی بەرز لە عێراق.",
  };

  return {
    title: titles[lang as keyof typeof titles],
    description: descriptions[lang as keyof typeof descriptions],
  };
}

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
