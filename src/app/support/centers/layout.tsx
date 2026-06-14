import { Metadata } from "next";
import { getLang } from "@/lib/lang";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();

  const titles = {
    en: "Service Centers | Chrani Support",
    ar: "مراكز الخدمة | دعم چراني",
    ku: "ناوەندی خزمەتگوزاری | پاڵپشتی چرانى",
  };

  const descriptions = {
    en: "Find all authorized Chrani service centers across Iraq. Search by city and find the nearest maintenance center.",
    ar: "ابحث عن جميع مراكز الصيانة المعتمدة لچراني في العراق. ابحث حسب المدينة وابحث عن أقرب مركز صيانة.",
    ku: "هەموو ناوەندەکانی خزمەتگوزاری چرانى لە عێراق بدۆزەرەوە. بە شار بگەڕێ و نزیکترین ناوەندی چاککردنەوە بدۆزەرەوە.",
  };

  return {
    title: titles[lang as keyof typeof titles],
    description: descriptions[lang as keyof typeof descriptions],
  };
}

export default function CentersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
