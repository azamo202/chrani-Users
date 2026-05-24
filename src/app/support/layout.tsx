import { Metadata } from "next";
import { getLang } from "@/lib/lang";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();

  const titles = {
    en: "Support Center | Manuals & Service",
    ar: "مركز الدعم | الكتالوجات ومراكز الصيانة",
    ku: "ناوەندی پاڵپشتی | ڕێبەرەکان و خزمەتگوزاری",
  };

  const descriptions = {
    en: "Find user manuals, helpful videos, and authorized service centers for your Chrani appliances.",
    ar: "ابحث عن أدلة الاستخدام، الفيديوهات التعليمية، ومراكز الصيانة المعتمدة لأجهزة چراني الخاصة بك.",
    ku: "ڕێبەری بەکارهێنان، ڤیدیۆی فێرکاری، و ناوەندەکانی خزمەتگوزاری بۆ ئامێرەکانی چرانی بدۆزەرەوە.",
  };

  return {
    title: titles[lang as keyof typeof titles],
    description: descriptions[lang as keyof typeof descriptions],
  };
}

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
