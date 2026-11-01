import Link from "next/link";

/**
 * Custom 404 page.
 *
 * Next.js renders it for unknown URLs and for every `notFound()` call, such as
 * an invalid or missing post id on `/posts/[id]`.
 * It is a Server Component, so it needs no client-side code.
 */

/**
 * this is just ui
 */
export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
          Error 404
        </p>

        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          Page not found
        </h1>

        <p className="mt-4 text-sm text-muted-foreground">
          The page you are looking for does not exist, or it may have been moved.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/posts"
            className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background hover:opacity-90"
          >
            Browse posts
          </Link>
          <Link
            href="/"
            className="rounded-full border border-border px-5 py-2 text-sm font-medium hover:bg-muted"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}