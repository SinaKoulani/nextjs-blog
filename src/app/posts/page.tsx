import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { fetchPublishedPosts } from "@/api/services/public/posts.service";

export const metadata: Metadata = {
  title: "Posts",
  description: "Browse all published blog posts.",
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
 * Fetches and renders the list of published posts (Server Component).
 *
 * This is the request-time part of the page, so it must be rendered inside
 * a `<Suspense>` boundary. Backend errors are shown inline using
 * `appHttpErr.displayMessage`.
 */
async function PostsList() {
  await connection();

  const result = await fetchPublishedPosts();

  if (!result.isOK) {
    return (
      <p role="alert" className="mt-6 text-sm text-destructive">
        {result.error.displayMessage}
      </p>
    );
  }

  const posts = result.data;

  if (posts.length === 0) {
    return <p className="mt-6 text-sm text-muted-foreground">No posts yet.</p>;
  }

  return (
    <ul className="mt-10 space-y-4">
      {posts.map((post) => {
        const createdAt = formatDate(post.createdAt);

        return (
          <li
            key={post.id}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <h2 className="text-xl font-semibold">
              <Link href={`/posts/${post.id}`} className="hover:underline">
                {post.title}
              </Link>
            </h2>

            {post.excerpt ? (
              <p className="mt-2 text-sm text-muted-foreground">
                {post.excerpt}
              </p>
            ) : null}

            {createdAt ? (
              <p className="mt-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {createdAt}
              </p>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Public list of published posts.
 *
 * The page shell is static; the list streams in through `<Suspense>`.
 * Data comes from `fetchPublishedPosts` (src/api/services/public/posts.service.ts).
 */
export default function PostsPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col px-6 py-16">
      <h1 className="text-4xl font-semibold tracking-tight">Posts</h1>

      <Suspense
        fallback={
          <p className="mt-6 text-sm text-muted-foreground">Loading posts...</p>
        }
      >
        <PostsList />
      </Suspense>
    </main>
  );
}
