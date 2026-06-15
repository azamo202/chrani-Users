import { ApiCategory } from "@/types/api";
import { resolveImageUrl } from "@/utils/image";

export const normalizeCategory = (raw: any): ApiCategory => {
  if (!raw) return raw;
  return {
    ...raw,
    image: raw.image ? resolveImageUrl(raw.image) : undefined,
    children: Array.isArray(raw.children) ? raw.children.map(normalizeCategory) : undefined,
    parent: raw.parent ? normalizeCategory(raw.parent) : undefined,
  };
};

export const normalizeCategories = (rawList: any[]): ApiCategory[] => {
  if (!Array.isArray(rawList)) return [];
  return rawList.map(normalizeCategory);
};
