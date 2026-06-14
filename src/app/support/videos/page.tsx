import { fetchApi } from "@/lib/api";
import { ApiVideo } from "@/types/api";
import { VideosClient } from "@/components/support/VideosClient";
import { Suspense } from "react";

export default async function VideosPage() {
  let tutorials: ApiVideo[] = [];

  try {
    tutorials = await fetchApi<ApiVideo[]>("/api/site/videos", {
      next: { revalidate: 3600, tags: ["videos"] },
    }).catch(() => []);
  } catch (error) {
    console.error("Failed to fetch videos:", error);
  }

  return (
    <Suspense fallback={<div className="container-wide py-20 text-center">Loading...</div>}>
      <VideosClient tutorials={tutorials} />
    </Suspense>
  );
}
