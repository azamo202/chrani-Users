import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const headerSecret = request.headers.get("x-revalidate-secret");
    const querySecret = searchParams.get("secret");
    const secret = headerSecret || querySecret;

    const expectedSecret = process.env.NEXT_REVALIDATE_SECRET;

    if (!expectedSecret) {
      return NextResponse.json(
        { error: "Revalidation secret is not configured on the server" },
        { status: 500 }
      );
    }

    if (secret !== expectedSecret) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid secret token" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { tags } = body;

    if (!tags || !Array.isArray(tags)) {
      return NextResponse.json(
        { error: "Bad Request: 'tags' parameter is required and must be an array" },
        { status: 400 }
      );
    }

    const revalidatedTags: string[] = [];
    for (const tag of tags) {
      if (typeof tag === "string" && tag.trim() !== "") {
        revalidateTag(tag, "max");
        revalidatedTags.push(tag);
      }
    }

    return NextResponse.json({
      success: true,
      revalidated: true,
      tags: revalidatedTags,
      now: Date.now(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = request.headers.get("x-revalidate-secret") || searchParams.get("secret");
    const expectedSecret = process.env.NEXT_REVALIDATE_SECRET;

    if (!expectedSecret) {
      return NextResponse.json(
        { error: "Revalidation secret is not configured" },
        { status: 500 }
      );
    }

    if (secret !== expectedSecret) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const tag = searchParams.get("tag");
    if (!tag) {
      return NextResponse.json(
        { error: "Missing 'tag' parameter" },
        { status: 400 }
      );
    }

    revalidateTag(tag, "max");

    return NextResponse.json({
      success: true,
      revalidated: true,
      tag,
      now: Date.now(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
