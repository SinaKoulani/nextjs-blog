import Link from "next/link";
import { connection } from "next/server";
import { fetchPublishedPosts } from "@/api/services/public/posts.service";
import type { Post } from "@/types/post.type";

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

function byNewest(a: Post, b: Post): number {
  return (Date.parse(b.createdAt) || 0) - (Date.parse(a.createdAt) || 0);
}

export default async function Home() {
  await connection();

  const result = await fetchPublishedPosts({
    sortBy: "createdAt",
    sortOrder: "DESC",
  });

  const posts = result.isOK ? [...result.data].sort(byNewest) : [];
  const featured = posts[0];
  const latest = posts.slice(1, 4);
  const featuredDate = featured ? formatDate(featured.createdAt) : null;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section
        className={`mx-auto grid max-w-6xl gap-10 px-6 py-16 md:py-24 ${
          featured ? "md:grid-cols-[1.25fr_0.75fr]" : ""
        }`}
      >
        <div className="space-y-8">
          <div className="space-y-6">
            <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
              Notes from the edge of product, code, and craft.
            </h1>
            <p className="max-w-lg text-lg leading-8 text-muted-foreground">
              Fresh perspectives, practical systems, and stories from teams
              shipping thoughtfully in a noisy world.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/posts"
              className="inline-flex rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background"
            >
              Read the latest
            </Link>
            <Link
              href="/signup"
              className="inline-flex rounded-full border border-border px-5 py-3 text-sm font-medium text-foreground"
            >
              Create account
            </Link>
          </div>

          {!featured ? (
            <p className="text-sm text-muted-foreground">
              No posts to show right now.
            </p>
          ) : null}
        </div>

        {featured ? (
          <div className="rounded-3xl border border-border bg-muted p-6 shadow-sm">
            <div className="mb-6 text-sm text-muted-foreground">
              Featured story
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl bg-linear-to-br from-zinc-900 via-zinc-700 to-zinc-500 p-6 text-zinc-50">
                <h2 className="text-2xl font-semibold">{featured.title}</h2>
              </div>
              {featured.excerpt ? (
                <p className="text-sm leading-7 text-muted-foreground">
                  {featured.excerpt}
                </p>
              ) : null}
              {featuredDate ? (
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {featuredDate}
                </p>
              ) : null}
              <Link
                href={`/posts/${featured.id}`}
                className="inline-flex text-sm font-medium text-foreground"
              >
                Read article →
              </Link>
            </div>
          </div>
        ) : null}
      </section>

      {latest.length > 0 ? (
        <section className="mx-auto max-w-6xl px-6 pb-20">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">
              Latest articles
            </h2>
            <Link href="/posts" className="text-sm font-medium text-foreground">
              View all
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {latest.map((post) => {
              const createdAt = formatDate(post.createdAt);

              return (
                <article
                  key={post.id}
                  className="rounded-2xl border border-border bg-card p-5 shadow-sm"
                >
                  {createdAt ? (
                    <p className="mb-4 text-xs uppercase tracking-[0.12em] text-muted-foreground">
                      {createdAt}
                    </p>
                  ) : null}
                  <h3 className="text-xl font-semibold leading-snug text-foreground">
                    {post.title}
                  </h3>
                  {post.excerpt ? (
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      {post.excerpt}
                    </p>
                  ) : null}
                  <Link
                    href={`/posts/${post.id}`}
                    className="mt-5 inline-flex text-sm font-medium text-foreground"
                  >
                    Read article →
                  </Link>
                </article>
              );
            })}
          </div>
        </section>
      ) : null}
    </main>
  );
}