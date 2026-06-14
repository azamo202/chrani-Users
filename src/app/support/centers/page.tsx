import { fetchApi } from "@/lib/api";
import { ApiMaintenanceCenter } from "@/types/api";
import { CentersClient } from "@/components/support/CentersClient";
import { Suspense } from "react";

export default async function CentersPage() {
  let serviceCenters: ApiMaintenanceCenter[] = [];

  try {
    serviceCenters = await fetchApi<ApiMaintenanceCenter[]>("/api/site/maintenance-centers", {
      next: { revalidate: 3600, tags: ["maintenance-centers"] },
    }).catch(() => []);
  } catch (error) {
    console.error("Failed to fetch service centers:", error);
  }

  return (
    <Suspense fallback={<div className="container-wide py-20 text-center">Loading...</div>}>
      <CentersClient serviceCenters={serviceCenters} />
    </Suspense>
  );
}
