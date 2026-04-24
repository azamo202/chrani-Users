"use client";

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";

export type Lang = "en" | "ar" | "ku";

type Dict = Record<string, string>;
const dictionaries: Record<Lang, Dict> = {
  en: {
    "nav.home": "Home",
    "nav.products": "Products",
    "nav.support": "Support",
    "nav.about": "About",
    "nav.contact": "Contact",
    "cta.browse": "Browse Catalog",
    "cta.inquire": "Inquire via WhatsApp",
    "cta.viewAll": "View all",
    "cta.help.title": "Need help choosing?",
    "cta.help.subtitle": "Our specialists will walk you through the catalog and recommend the right model for your home.",
    "home.hero.eyebrow": "Premium Home Appliances",
    "home.hero.title": "Engineered for the Modern Home",
    "home.hero.subtitle": "Discover the Chrani collection — refined design, lasting performance, and quiet excellence in every appliance.",
    "home.featured": "Featured Products",
    "home.new": "New Arrivals",
    "home.categories": "Main Categories",
    "products.title": "The Catalog",
    "products.subtitle": "Browse our full range of premium appliances.",
    "filter.brand": "Brand",
    "filter.category": "Category",
    "filter.price": "Price Range",
    "filter.clear": "Clear filters",
    "filter.results": "results",
    "product.description": "Description",
    "product.specs": "Technical Specs",
    "product.features": "Features",
    "product.brand": "Brand",
    "product.category": "Category",
    "product.model": "Model",
    "support.title": "Support & Warranty Center",
    "support.subtitle": "Manuals, video tutorials, and your nearest service centers.",
    "support.downloads": "User Manuals",
    "support.videos": "Video Tutorials",
    "support.centers": "Service Centers",
    "support.download": "Download PDF",
    "about.title": "About Chrani",
    "about.subtitle": "Crafting premium living since 1985.",
    "about.history": "Our History",
    "about.vision": "Our Vision",
    "about.mission": "Our Mission",
    "contact.title": "Contact Us",
    "contact.subtitle": "We'd love to hear from you.",
    "contact.phone": "Phone",
    "contact.email": "Email",
    "contact.address": "Address",
    "contact.social": "Follow us",
    "footer.tagline": "Premium home appliances, refined for modern living.",
    "footer.quickLinks": "Quick Links",
    "footer.contact": "Contact",
    "footer.rights": "All rights reserved.",
    "warranty": "10-yr warranty",
    "delivery": "Free delivery",
    "service": "Premium service"
  },

  ar: {
    "nav.home": "الرئيسية",
    "nav.products": "المنتجات",
    "nav.support": "الدعم",
    "nav.about": "من نحن",
    "nav.contact": "اتصل بنا",
    "cta.browse": "تصفح الكتالوج",
    "cta.inquire": "استفسر عبر واتساب",
    "cta.viewAll": "عرض الكل",
    "cta.help.title": "تحتاج مساعدة في الاختيار؟",
    "cta.help.subtitle": "سيقوم خبراؤنا بإرشادك عبر الكتالوج واقتراح الموديل المناسب لمنزلك.",
    "home.hero.eyebrow": "أجهزة منزلية فاخرة",
    "home.hero.title": "مصممة للمنزل العصري",
    "home.hero.subtitle": "اكتشف مجموعة شراني — تصميم راقٍ، أداء يدوم، وتميّز هادئ في كل جهاز.",
    "home.featured": "المنتجات المميزة",
    "home.new": "وصل حديثاً",
    "home.categories": "الفئات الرئيسية",
    "products.title": "الكتالوج",
    "products.subtitle": "تصفح مجموعتنا الكاملة من الأجهزة الفاخرة.",
    "filter.brand": "العلامة التجارية",
    "filter.category": "الفئة",
    "filter.price": "نطاق السعر",
    "filter.clear": "مسح الفلاتر",
    "filter.results": "نتيجة",
    "product.description": "الوصف",
    "product.specs": "المواصفات الفنية",
    "product.features": "المميزات",
    "product.brand": "العلامة",
    "product.category": "الفئة",
    "product.model": "الموديل",
    "support.title": "مركز الدعم والضمان",
    "support.subtitle": "أدلة، فيديوهات تعليمية، وأقرب مراكز الصيانة.",
    "support.downloads": "أدلة الاستخدام",
    "support.videos": "فيديوهات تعليمية",
    "support.centers": "مراكز الخدمة",
    "support.download": "تحميل PDF",
    "about.title": "عن شراني",
    "about.subtitle": "نصنع الفخامة منذ 1985.",
    "about.history": "تاريخنا",
    "about.vision": "رؤيتنا",
    "about.mission": "رسالتنا",
    "contact.title": "اتصل بنا",
    "contact.subtitle": "يسعدنا تواصلك معنا.",
    "contact.phone": "الهاتف",
    "contact.email": "البريد الإلكتروني",
    "contact.address": "العنوان",
    "contact.social": "تابعنا",
    "footer.tagline": "أجهزة منزلية فاخرة، مصممة للحياة العصرية.",
    "footer.quickLinks": "روابط سريعة",
    "footer.contact": "اتصل",
    "footer.rights": "جميع الحقوق محفوظة.",
     "warranty": "ضمان لمدة 10 سنوات",
    "delivery": "توصيل مجاني",
    "service": "خدمة مميزة",

  },
  ku: {
    "warranty": "گرەنتی ١٠ ساڵە",
    "delivery": "گەیاندنی خۆڕایی",
    "service": "خزمەتگوزاری نایاب",
    "nav.home": "ماڵەوە",
    "nav.products": "بەرهەمەکان",
    "nav.support": "پاڵپشتی",
    "nav.about": "دەربارە",
    "nav.contact": "پەیوەندی",
    "cta.browse": "کاتالۆگ ببینە",
    "cta.inquire": "پرسیار لە واتسئاپ",
    "cta.viewAll": "هەمووی ببینە",
    "cta.help.title": "پێویستت بە یارمەتییە لە هەڵبژاردندا؟",
    "cta.help.subtitle": "شارەزایانمان بەناو کاتالۆگەکەدا ڕێنوێنیت دەکەن و باشترین مۆدێل بۆ ماڵەکەت پێشنیار دەکەن.",
    "home.hero.eyebrow": "ئامێری ماڵەوەی پرێمیۆم",
    "home.hero.title": "دیزاینکراو بۆ ماڵی نوێ",
    "home.hero.subtitle": "کۆکراوەی چرانی بدۆزەرەوە — دیزاینی جوان، کارایی بەردەوام، و باشی بێدەنگ لە هەموو ئامێرێکدا.",
    "home.featured": "بەرهەمە تایبەتەکان",
    "home.new": "نوێ گەیشتوو",
    "home.categories": "بەشە سەرەکییەکان",
    "products.title": "کاتالۆگ",
    "products.subtitle": "هەموو ئامێرە پرێمیۆمەکانمان ببینە.",
    "filter.brand": "براند",
    "filter.category": "بەش",
    "filter.price": "نرخ",
    "filter.clear": "پاککردنەوە",
    "filter.results": "ئەنجام",
    "product.description": "وەسف",
    "product.specs": "تایبەتمەندی تەکنیکی",
    "product.features": "تایبەتمەندیەکان",
    "product.brand": "براند",
    "product.category": "بەش",
    "product.model": "مۆدێل",
    "support.title": "ناوەندی پاڵپشتی و گەرەنتی",
    "support.subtitle": "ڕێبەر، ڤیدیۆ، و ناوەندی خزمەتگوزاری.",
    "support.downloads": "ڕێبەری بەکارهێنان",
    "support.videos": "ڤیدیۆی فێرکاری",
    "support.centers": "ناوەندی خزمەتگوزاری",
    "support.download": "PDF دابگرە",
    "about.title": "دەربارەی چرانی",
    "about.subtitle": "دروستکردنی ژیانی پرێمیۆم لە 1985 ەوە.",
    "about.history": "مێژوومان",
    "about.vision": "بینینمان",
    "about.mission": "ئامانجمان",
    "contact.title": "پەیوەندیمان پێوە بکە",
    "contact.subtitle": "خۆشحاڵ دەبین گوێبیستت بین.",
    "contact.phone": "تەلەفۆن",
    "contact.email": "ئیمەیڵ",
    "contact.address": "ناونیشان",
    "contact.social": "شوێنمان بکە",
    "footer.tagline": "ئامێری ماڵەوەی پرێمیۆم، بۆ ژیانی نوێ.",
    "footer.quickLinks": "بەستەرەکان",
    "footer.contact": "پەیوەندی",
    "footer.rights": "هەموو مافەکان پارێزراون.",
  },
};



interface I18nCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
}

const I18nContext = createContext<I18nCtx | null>(null);

export const I18nProvider = ({ children, initialLang = "en" }: { children: ReactNode; initialLang?: Lang }) => {
  const [lang, setLangState] = useState<Lang>(initialLang);

  const dir: "ltr" | "rtl" = lang === "ar" || lang === "ku" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  const setLang = (l: Lang) => {
    localStorage.setItem("chrani-lang", l);
    document.cookie = `chrani-lang=${l}; path=/; max-age=31536000`; // حفظ في الكوكيز ليتعرف عليها السيرفر
    setLangState(l);
  };

  const value = useMemo<I18nCtx>(() => ({
    lang,
    setLang,
    dir,
    t: (key: string) => dictionaries[lang][key] ?? dictionaries.en[key] ?? key,
  }), [lang, dir]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
};
