import { Metadata } from "next";
import { getLang } from "@/lib/lang";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();

  const titles = {
    en: "Contact Us | Chrani Company",
    ar: "اتصل بنا | شركة چراني",
    ku: "پەیوەندیمان پێوە بکە | کۆمپانیای چرانی",
  };

  const descriptions = {
    en: "Contact Chrani Company in Duhok, Iraq. Find our location, phone numbers, and social media.",
    ar: "اتصل بشركة چراني في دهوك، العراق. ابحث عن موقعنا، أرقام الهواتف، ووسائل التواصل الاجتماعي.",
    ku: "پەیوەندی بە کۆمپانیای چرانی بکە لە دهۆک، عێراق. ناونیشان، ژمارەی تەلەفۆن، و سۆشیاڵ میدیا بدۆزەرەوە.",
  };

  return {
    title: titles[lang as keyof typeof titles],
    description: descriptions[lang as keyof typeof descriptions],
  };
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
