import { fetchApi } from "@/lib/api";
import { ApiMaintenanceCenter, ApiVideo, ApiDownload } from "@/types/api";
import { SupportClient } from "@/components/support/SupportClient";
import { Suspense } from "react";
import { CACHE_TTL } from "@/lib/constants";

export default async function Support() {
  const [manualsResult, tutorialsResult, centersResult] = await Promise.allSettled([
    fetchApi<ApiDownload[]>("/api/site/downloads", {
      next: { revalidate: CACHE_TTL.supportData, tags: ["downloads"] },
    }),
    fetchApi<ApiVideo[]>("/api/site/videos", {
      next: { revalidate: CACHE_TTL.supportData, tags: ["videos"] },
    }),
    fetchApi<ApiMaintenanceCenter[]>("/api/site/maintenance-centers", {
      next: { revalidate: CACHE_TTL.supportData, tags: ["maintenance-centers"] },
    }),
  ]);

  const manuals =
    manualsResult.status === "fulfilled" ? (manualsResult.value ?? []) : [];
  const tutorials =
    tutorialsResult.status === "fulfilled" ? (tutorialsResult.value ?? []) : [];
  const serviceCenters =
    centersResult.status === "fulfilled" ? (centersResult.value ?? []) : [];

  if (manualsResult.status === "rejected") {
    console.error("[Support] Failed to fetch manuals:", manualsResult.reason);
  }
  if (tutorialsResult.status === "rejected") {
    console.error("[Support] Failed to fetch tutorials:", tutorialsResult.reason);
  }
  if (centersResult.status === "rejected") {
    console.error("[Support] Failed to fetch service centers:", centersResult.reason);
  }

  return (
    <Suspense
      fallback={
        <div className="container py-20 text-center text-muted-foreground">
          Loading support...
        </div>
      }
    >
      <SupportClient
        manuals={manuals}
        tutorials={tutorials}
        serviceCenters={serviceCenters}
        initialSearch=""
      />
    </Suspense>
  );
}
