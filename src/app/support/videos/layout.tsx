import { Metadata } from "next";
import { getLang } from "@/lib/lang";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();

  const titles = {
    en: "Videos | Chrani Support",
    ar: "الفيديوهات | دعم چراني",
    ku: "ڤیدیۆکان | پاڵپشتی چرانى",
  };

  const descriptions = {
    en: "Watch all helpful tutorial videos and guides for your Chrani home appliances.",
    ar: "شاهد جميع الفيديوهات التعليمية والإرشادية لأجهزة چراني المنزلية.",
    ku: "هەموو ڤیدیۆی فێرکاری و ڕێنمایی بۆ ئامێرەکانی ناوماڵی چرانى تەماشا بکە.",
  };

  return {
    title: titles[lang as keyof typeof titles],
    description: descriptions[lang as keyof typeof descriptions],
  };
}

export default function VideosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
