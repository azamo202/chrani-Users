import { NextResponse } from "next/server";

/**
 * GET /api/health
 *
 * Lightweight health-check endpoint for monitoring tools (e.g. UptimeRobot,
 * Nginx, AWS ALB, Kubernetes probes).
 *
 * Returns HTTP 200 with a JSON payload if the application is running normally.
 * The endpoint intentionally does NOT check the upstream API — that would make
 * every health probe dependent on the backend, causing false alarms when the
 * backend is temporarily unavailable but the Next.js server is fine.
 */
export async function GET() {
  return NextResponse.json(
    {
      status: "ok",
      service: "chrani-catalog",
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      environment: process.env.NODE_ENV ?? "unknown",
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    }
  );
}
