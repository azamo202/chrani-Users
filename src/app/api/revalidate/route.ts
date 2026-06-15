import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

// Next.js 16 changed the TS type of revalidateTag to require a second argument;
// cast to the single-arg form so we can keep using it normally at runtime.
const _revalidateTag = revalidateTag as (tag: string) => void;


/**
 * POST /api/revalidate
 *
 * Trigger on-demand ISR cache invalidation for one or more tags.
 * Called by the backend (or a CI/CD pipeline) after content changes.
 *
 * Body:  { tags: string[] }
 * Auth:  x-revalidate-secret header  OR  ?secret=... query param
 */
export async function POST(request: NextRequest) {
  try {
    const secret = getSecret(request);
    const authError = validateSecret(secret);
    if (authError) return authError;

    // Parse body safely
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return jsonError("Request body must be valid JSON", 400);
    }

    if (!body || typeof body !== "object" || !("tags" in body)) {
      return jsonError("Body must contain a 'tags' array", 400);
    }

    const { tags } = body as { tags: unknown };

    if (!Array.isArray(tags) || tags.length === 0) {
      return jsonError("'tags' must be a non-empty array of strings", 400);
    }

    const revalidatedTags: string[] = [];
    const invalidTags: unknown[] = [];

    for (const tag of tags) {
      if (typeof tag === "string" && tag.trim() !== "") {
        _revalidateTag(tag.trim());
        revalidatedTags.push(tag.trim());
      } else {
        invalidTags.push(tag);
      }
    }

    return NextResponse.json({
      success: true,
      revalidated: revalidatedTags,
      skipped: invalidTags,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    console.error("[/api/revalidate POST]", error);
    return jsonError(message, 500);
  }
}

/**
 * GET /api/revalidate?tag=products
 *
 * Convenience single-tag revalidation (useful for quick manual triggers).
 */
export async function GET(request: NextRequest) {
  try {
    const secret = getSecret(request);
    const authError = validateSecret(secret);
    if (authError) return authError;

    const tag = request.nextUrl.searchParams.get("tag");
    if (!tag || tag.trim() === "") {
      return jsonError("Missing 'tag' query parameter", 400);
    }

    _revalidateTag(tag.trim());

    return NextResponse.json({
      success: true,
      revalidated: [tag.trim()],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    console.error("[/api/revalidate GET]", error);
    return jsonError(message, 500);
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getSecret(req: NextRequest): string | null {
  return (
    req.headers.get("x-revalidate-secret") ??
    req.nextUrl.searchParams.get("secret")
  );
}

function validateSecret(provided: string | null): NextResponse | null {
  const expected = process.env.NEXT_REVALIDATE_SECRET;

  if (!expected) {
    console.error("[/api/revalidate] NEXT_REVALIDATE_SECRET env var is not set");
    return jsonError("Server misconfiguration: revalidation secret not configured", 500);
  }

  if (!provided || provided !== expected) {
    return jsonError("Unauthorized: invalid or missing secret", 401);
  }

  return null; // valid
}

function jsonError(message: string, status: number): NextResponse {
  return NextResponse.json({ error: message }, { status });
}
