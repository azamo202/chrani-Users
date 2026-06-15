import { ApiBrand } from "@/types/api";
import { resolveImageUrl } from "@/utils/image";

export const normalizeBrand = (raw: any): ApiBrand => {
  if (!raw) return raw;
  return {
    ...raw,
    logo: raw.logo ? resolveImageUrl(raw.logo) : undefined,
  };
};

export const normalizeBrands = (rawList: any[]): ApiBrand[] => {
  if (!Array.isArray(rawList)) return [];
  return rawList.map(normalizeBrand);
};
