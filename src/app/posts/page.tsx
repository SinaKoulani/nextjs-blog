import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { fetchPublishedPosts } from "@/api/services/posts.service";

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
 * Public list of published posts (Server Component).
 *
 * Data comes from `fetchPublishedPosts` (src/api/services/posts.service.ts).
 * Backend errors are shown inline using `appHttpErr.displayMessage`.
 */
export default async function PostsPage() {
  await connection();

  const result = await fetchPublishedPosts();

  if (!result.isOK) {
    return (
      <main className="mx-auto flex min-h-screen max-w-4xl flex-col px-6 py-16">
        <h1 className="text-4xl font-semibold tracking-tight">Posts</h1>
        <p role="alert" className="mt-6 text-sm text-destructive">
          {result.error.displayMessage}
        </p>
      </main>
    );
  }

  const posts = result.data;

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col px-6 py-16">
      <h1 className="text-4xl font-semibold tracking-tight">Posts</h1>

      {posts.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">No posts yet.</p>
      ) : (
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
      )}
    </main>
  );
}