import { fetchApi } from "@/lib/api";
import { ApiMaintenanceCenter, ApiVideo, ApiDownload } from "@/types/api";
import { SupportClient } from "@/components/support/SupportClient";

interface PageProps {
  searchParams: Promise<{ search?: string }>;
}

import { Suspense } from "react";

export default async function Support() {
  let manuals: ApiDownload[] = [];
  let tutorials: ApiVideo[] = [];
  let serviceCenters: ApiMaintenanceCenter[] = [];

  try {
    const [manualsData, tutorialsData, centersData] = await Promise.all([
      fetchApi<ApiDownload[]>("/api/site/downloads", { next: { revalidate: 3600, tags: ["downloads"] } }).catch(() => []),
      fetchApi<ApiVideo[]>("/api/site/videos", { next: { revalidate: 3600, tags: ["videos"] } }).catch(() => []),
      fetchApi<ApiMaintenanceCenter[]>("/api/site/maintenance-centers", { next: { revalidate: 3600, tags: ["maintenance-centers"] } }).catch(() => []),
    ]);

    manuals = manualsData;
    tutorials = tutorialsData;
    serviceCenters = centersData;
  } catch (error) {
    console.error("Failed to fetch support data:", error);
  }

  return (
    <Suspense fallback={<div className="container py-20 text-center">Loading support...</div>}>
      <SupportClient 
        manuals={manuals} 
        tutorials={tutorials} 
        serviceCenters={serviceCenters} 
        initialSearch=""
      />
    </Suspense>
  );
}
