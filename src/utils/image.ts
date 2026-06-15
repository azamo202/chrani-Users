import { API_BASE_URL } from "@/lib/constants";

/**
 * Resolves any raw image object or string into a fully qualified URL.
 * It handles raw API fields like `image_path`, `url`, `path`, and relative paths.
 * Fallback to a placeholder image if nothing is found.
 */
export const resolveImageUrl = (image?: any): string => {
  if (!image) return "https://placehold.co/600x400/f3f4f6/6b7280?text=No+Image";

  let path = "";
  if (typeof image === "string") {
    path = image;
  } else if (typeof image === "object") {
    path = image.image_path || image.url || image.path;
  }

  if (!path) return "https://placehold.co/600x400/f3f4f6/6b7280?text=No+Image";

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  if (cleanPath.startsWith("storage/")) {
    return `${API_BASE_URL}/${cleanPath}`;
  }
  return `${API_BASE_URL}/storage/${cleanPath}`;
};
