"use client";

import Link from "next/link";

/**
 * 404 Not Found page.
 *
 * This is a server-exportable component in Next.js App Router.
 * It does NOT use client hooks — only plain HTML with Tailwind.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
        <span className="font-display text-4xl font-bold text-primary" aria-hidden="true">
          404
        </span>
      </div>
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
          Page Not Found
        </h1>
        <p className="mt-3 max-w-md text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or may have been
          moved.
        </p>
      </div>
      <div className="flex gap-3">
        <Link
          href="/"
          className="rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
        >
          Go Home
        </Link>
        <Link
          href="/products"
          className="rounded-full border border-border px-7 py-3 text-sm font-semibold transition hover:border-primary hover:text-primary"
        >
          Browse Products
        </Link>
      </div>
    </div>
  );
}
