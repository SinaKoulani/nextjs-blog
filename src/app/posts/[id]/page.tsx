import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { fetchPublishedPost } from "@/api/services/posts.service";

type PostPageProps = {
  params: Promise<{ id: string }>;
};

/**
 * Formats an ISO date string for display.
 *
 * @param iso Date string returned by the backend.
 * @returns A readable date, or `null` when the value is not a valid date.
 */
function formatDate(iso: string): string | null {
  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Public page for one published post (`/posts/[id]`), rendered as a Server Component.
 *
 * - `params` is a Promise in Next.js 16, so it is awaited.
 * - A non-integer or non-positive id calls `notFound()` without contacting the
 *   backend. A 400 or 404 from the backend does the same.
 * - Any other backend failure is shown inline with `appHttpErr.displayMessage`.
 * - `connection()` makes the page render on every request, so the backend is
 *   never called at build time.
 * - The post body (blocks) is not rendered yet.
 */
export default async function PostPage({ params }: PostPageProps) {
  await connection();

  const { id } = await params;
  const postId = Number(id);

  if (!Number.isInteger(postId) || postId <= 0) {
    notFound();
  }

  const result = await fetchPublishedPost(postId);

  if (!result.isOK) {
    if (result.error.statusCode === 400 || result.error.statusCode === 404) {
      notFound();
    }

    return (
      <main className="mx-auto flex min-h-screen max-w-3xl flex-col px-6 py-16">
        <Link href="/posts" className="text-sm text-muted-foreground hover:underline">
          Back to posts
        </Link>
        <p role="alert" className="mt-6 text-sm text-destructive">
          {result.error.displayMessage}
        </p>
      </main>
    );
  }

  const post = result.data;
  const createdAt = formatDate(post.createdAt);

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col px-6 py-16">
      <Link href="/posts" className="text-sm text-muted-foreground hover:underline">
        Back to posts
      </Link>

      <article className="mt-8">
        <h1 className="text-4xl font-semibold tracking-tight">{post.title}</h1>

        {createdAt ? (
          <p className="mt-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {createdAt}
          </p>
        ) : null}

        {post.excerpt ? (
          <p className="mt-6 text-lg text-muted-foreground">{post.excerpt}</p>
        ) : null}
      </article>
    </main>
  );
}
