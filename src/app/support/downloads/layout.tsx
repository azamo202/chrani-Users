import { Metadata } from "next";
import { getLang } from "@/lib/lang";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();

  const titles = {
    en: "User Manuals | Chrani Support",
    ar: "أدلة الاستخدام | دعم چراني",
    ku: "ڕێبەری بەکارهێنان | پاڵپشتی چرانى",
  };

  const descriptions = {
    en: "Download all user manuals and guides for Chrani home appliances.",
    ar: "حمّل جميع أدلة الاستخدام والإرشادات لأجهزة چراني المنزلية.",
    ku: "هەموو ڕێبەرەکانی بەکارهێنان بۆ ئامێرەکانی ناوماڵی چرانى دابگرە.",
  };

  return {
    title: titles[lang as keyof typeof titles],
    description: descriptions[lang as keyof typeof descriptions],
  };
}

export default function DownloadsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
