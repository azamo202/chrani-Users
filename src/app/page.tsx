import { fetchApi } from "@/lib/api";
import { ApiHomeSection, ApiCategory } from "@/types/api";
import { HomePageClient } from "@/components/home/HomePageClient";

export default async function Home() {
  let sections: ApiHomeSection[] = [];
  let categories: ApiCategory[] = [];
  
  try {
    const [sectionsData, categoriesData] = await Promise.all([
      fetchApi<ApiHomeSection[]>("/api/site/home-sections", { next: { revalidate: 60, tags: ["home-sections"] } }),
      fetchApi<ApiCategory[]>("/api/site/categories", { next: { revalidate: 60, tags: ["categories"] } }),
    ]);
    sections = sectionsData;
    categories = categoriesData;
  } catch (error) {
    console.error("Failed to fetch home data:", error);
  }

  return <HomePageClient sections={sections} categories={categories} />;
}
