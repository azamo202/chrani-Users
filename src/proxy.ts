import { NextRequest, NextResponse } from "next/server";

/**
 * Next.js 16+ Proxy — replaces the deprecated "middleware" file.
 *
 * Responsibilities:
 *  1. Inject security HTTP headers on every response.
 *  2. Rate-limit sensitive API endpoints.
 */

// ─── Rate Limiting ────────────────────────────────────────────────────────────
// In-memory store — suitable for single-server deployments.
// For multi-server / Edge deployments, replace with Redis (e.g. @upstash/ratelimit).
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function getIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded ? (forwarded.split(",")[0] ?? "unknown").trim() : "unknown";
}

function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return false; // not limited
  }
  if (entry.count >= limit) return true; // limited
  entry.count++;
  return false;
}

// Prune expired entries every 500 requests to prevent memory leaks
let pruneCounter = 0;
function maybePrune() {
  if (++pruneCounter % 500 === 0) {
    const now = Date.now();
    for (const [k, v] of rateLimitMap) {
      if (now > v.resetAt) rateLimitMap.delete(k);
    }
  }
}

// ─── Proxy Handler ────────────────────────────────────────────────────────────
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  maybePrune();

  const ip = getIp(req);

  // Rate-limit: /api/revalidate — 20 req/min
  if (pathname.startsWith("/api/revalidate")) {
    if (isRateLimited(`rev:${ip}`, 20, 60_000)) {
      return NextResponse.json(
        { error: "Too Many Requests" },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }
  }

  // Rate-limit: all other /api/* — 120 req/min
  if (pathname.startsWith("/api/")) {
    if (isRateLimited(`api:${ip}`, 120, 60_000)) {
      return NextResponse.json(
        { error: "Too Many Requests" },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }
  }

  // Inject security headers
  const res = NextResponse.next();

  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-XSS-Protection", "1; mode=block");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=()"
  );
  res.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https: http:",
      "connect-src 'self' https://api.chranico.com https://chranicatalog-premium.onrender.com",
      "frame-src https://www.google.com https://www.youtube.com",
      "object-src 'none'",
      "base-uri 'self'",
    ].join("; ")
  );
  res.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains"
  );

  return res;
}

// Apply proxy to all routes except static files
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|woff2?|ttf|otf)$).*)",
  ],
};
