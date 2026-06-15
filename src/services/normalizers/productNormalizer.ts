import { ApiProduct } from "@/types/api";
import { resolveImageUrl } from "@/utils/image";

/**
 * Normalizes a raw product payload to ensure strict structural compliance
 * with the frontend `ApiProduct` interface. Crucially, guarantees that
 * all image fields are fully resolved URLs.
 */
export const normalizeProduct = (raw: any): ApiProduct => {
  if (!raw) return raw;

  return {
    ...raw,
    // Ensure all images have a fully resolved `url` and remove dependency on raw paths
    images: Array.isArray(raw.images)
      ? raw.images.map((img: any) => ({
          ...img,
          url: resolveImageUrl(img),
        }))
      : [],
    // Safely normalize brand logo
    ...(raw.brand && {
      brand: {
        ...raw.brand,
        logo: raw.brand.logo ? resolveImageUrl(raw.brand.logo) : undefined,
      },
    }),
    // Safely normalize category image
    ...(raw.category && {
      category: {
        ...raw.category,
        image: raw.category.image ? resolveImageUrl(raw.category.image) : undefined,
      },
    }),
  };
};

/**
 * Normalizes an array of raw product payloads.
 */
export const normalizeProducts = (rawList: any[]): ApiProduct[] => {
  if (!Array.isArray(rawList)) return [];
  return rawList.map(normalizeProduct);
};
