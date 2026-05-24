import { Metadata } from "next";
import { getLang } from "@/lib/lang";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();

  const titles = {
    en: "About Us | Chrani Company",
    ar: "من نحن | شركة چراني",
    ku: "دەربارەی ئێمە | کۆمپانیای چرانی",
  };

  const descriptions = {
    en: "Learn about Chrani Company, a leading home appliance provider in Iraq since 2002.",
    ar: "تعرف على شركة چراني، الرائدة في استيراد وتوزيع الأجهزة المنزلية في العراق منذ عام 2002.",
    ku: "دەربارەی کۆمپانیای چرانی بزانە، کە پێشەنگە لە دابینکردنی ئامێرەکانی ناوماڵ لە عێراق لە ساڵی ٢٠٠٢ەوە.",
  };

  return {
    title: titles[lang as keyof typeof titles],
    description: descriptions[lang as keyof typeof descriptions],
  };
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
