/** @type {import("next").NextConfig} */
const isDev = process.env.NODE_ENV === "development";

const nextConfig = {
  reactStrictMode: true,

  // ─── Compression ────────────────────────────────────────────────────────────
  compress: true,

  // ─── Remove X-Powered-By header ─────────────────────────────────────────────
  poweredByHeader: false,

  // ─── Image optimisation ─────────────────────────────────────────────────────
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 3600,
    remotePatterns: [
      { protocol: "https", hostname: "chranicatalog-premium.onrender.com" },
      { protocol: "http",  hostname: "api.chranico.com" },
      { protocol: "https", hostname: "api.chranico.com" },
      { protocol: "http",  hostname: "127.0.0.1" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },

  // ─── HTTP Response Headers ──────────────────────────────────────────────────
  // Cache-Control headers are only applied in PRODUCTION.
  // Setting them in development causes the Next.js dev server warning and
  // can break HMR (Hot Module Replacement).
  async headers() {
    if (isDev) return []; // no custom headers in development

    return [
      // Next.js immutable static assets — cache 1 year
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Web fonts
      {
        source: "/fonts/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Public images
      {
        source: "/:path*.png",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
      },
      {
        source: "/:path*.jpg",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
      },
      {
        source: "/:path*.jpeg",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
      },
      {
        source: "/:path*.webp",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
      },
      {
        source: "/:path*.svg",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
      },
    ];
  },

  // ─── Experimental ───────────────────────────────────────────────────────────
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-accordion",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-popover",
      "@radix-ui/react-select",
      "@radix-ui/react-tabs",
      "@radix-ui/react-toast",
      "@radix-ui/react-tooltip",
      "recharts",
    ],
  },
};

export default nextConfig;
