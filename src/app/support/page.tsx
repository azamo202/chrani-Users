import { fetchApi } from "@/lib/api";
import { ApiMaintenanceCenter, ApiVideo, ApiDownload } from "@/types/api";
import { SupportClient } from "@/components/support/SupportClient";

interface PageProps {
  searchParams: Promise<{ search?: string }>;
}

import { Suspense } from "react";

export default async function Support({ searchParams }: PageProps) {
  const { search } = await searchParams;
  const searchQuery = search ? `?search=${encodeURIComponent(search)}` : "";

  let manuals: ApiDownload[] = [];
  let tutorials: ApiVideo[] = [];
  let serviceCenters: ApiMaintenanceCenter[] = [];

  try {
    const [manualsData, tutorialsData, centersData] = await Promise.all([
      fetchApi<ApiDownload[]>(`/api/site/downloads${searchQuery}`, { cache: "no-store" }).catch(() => []),
      fetchApi<ApiVideo[]>(`/api/site/videos${searchQuery}`, { cache: "no-store" }).catch(() => []),
      fetchApi<ApiMaintenanceCenter[]>(`/api/site/maintenance-centers${searchQuery}`, { cache: "no-store" }).catch(() => []),
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
        initialSearch={search || ""}
      />
    </Suspense>
  );
}
