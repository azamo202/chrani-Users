import { fetchApi } from "@/lib/api";
import { ApiDownload } from "@/types/api";
import { DownloadsClient } from "@/components/support/DownloadsClient";
import { Suspense } from "react";

export default async function DownloadsPage() {
  let manuals: ApiDownload[] = [];

  try {
    manuals = await fetchApi<ApiDownload[]>("/api/site/downloads", {
      next: { revalidate: 3600, tags: ["downloads"] },
    }).catch(() => []);
  } catch (error) {
    console.error("Failed to fetch downloads:", error);
  }

  return (
    <Suspense fallback={<div className="container-wide py-20 text-center">Loading...</div>}>
      <DownloadsClient manuals={manuals} />
    </Suspense>
  );
}
