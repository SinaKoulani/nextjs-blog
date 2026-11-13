import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { fetchPublishedPost } from "@/api/services/public/posts.service";
import { fetchInitialBlocks } from "@/api/services/public/blocks.service";
import { PostViewTracker } from "@/components/post-view-tracker";
import type { Block } from "@/types/block.type";

/**
 * Route props passed to the individual post page.
 */
type PostPageProps = {
  params: Promise<{ id: string }>;
};

/**
 * Formats an ISO date string into a human-readable date.
 *
 * @param iso - ISO date string to format.
 * @returns A localized display date, or null if the value is invalid.
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
 * Renders a single content block for the post body.
 *
 * @param props - The block to render.
 * @returns A JSX element representing the block content.
 */
function BlockView({ block }: { block: Block }) {
  if (block.type === "image") {
    return (
      <div
        role="img"
        aria-label="Image not available yet"
        className="flex h-48 items-center justify-center rounded-xl border border-dashed border-border bg-muted text-sm text-muted-foreground"
      >
        Image not available yet
      </div>
    );
  }

  if (!block.content) {
    return null;
  }

  return <p className="leading-7">{block.content}</p>;
}

/**
 * Request-time part of the post page (Server Component).
 *
 * Resolves the route param, validates the post id, fetches the post and its
 * initial content blocks, and renders the result or a not-found/error state.
 * Must be rendered inside a `<Suspense>` boundary.
 *
 * @param props - Route params containing the post id.
 * @returns The post page UI.
 */
async function PostContent({ params }: PostPageProps) {
  await connection();

  const { id } = await params;
  const postId = Number(id);

  if (!Number.isInteger(postId) || postId <= 0) {
    notFound();
  }

  const [postResult, blocksResult] = await Promise.all([
    fetchPublishedPost(postId),
    fetchInitialBlocks(postId),
  ]);

  if (!postResult.isOK) {
    if (
      postResult.error.statusCode === 400 ||
      postResult.error.statusCode === 404
    ) {
      notFound();
    }

    return (
      <main className="mx-auto flex min-h-screen max-w-3xl flex-col px-6 py-16">
        <Link
          href="/posts"
          className="text-sm text-muted-foreground hover:underline"
        >
          Back to posts
        </Link>
        <p role="alert" className="mt-6 text-sm text-[#e06c75]">
          {postResult.error.displayMessage}
        </p>
      </main>
    );
  }

  const post = postResult.data;
  const createdAt = formatDate(post.createdAt);
  const blocks = blocksResult.isOK
    ? [...blocksResult.data].sort((a, b) => a.position - b.position)
    : [];

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col px-6 py-16">
      <PostViewTracker postId={postId} />
      <Link
        href="/posts"
        className="text-sm text-muted-foreground hover:underline"
      >
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

        <div className="mt-10 space-y-6">
          {!blocksResult.isOK ? (
            <p role="alert" className="text-sm text-[#e06c75]">
              {blocksResult.error.displayMessage}
            </p>
          ) : blocks.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              This post has no content yet.
            </p>
          ) : (
            blocks.map((block) => <BlockView key={block.id} block={block} />)
          )}
        </div>
      </article>
    </main>
  );
}

/**
 * Page for a single published post.
 *
 * The route params are passed down as a promise and awaited inside the
 * `<Suspense>` boundary, so nothing request-specific blocks the prerender.
 *
 * @param props - Route params containing the post id.
 */
export default function PostPage({ params }: PostPageProps) {
  return (
    <Suspense
      fallback={
        <main className="mx-auto flex min-h-screen max-w-3xl flex-col px-6 py-16">
          <Link
            href="/posts"
            className="text-sm text-muted-foreground hover:underline"
          >
            Back to posts
          </Link>
          <p className="mt-6 text-sm text-muted-foreground">Loading post...</p>
        </main>
      }
    >
      <PostContent params={params} />
    </Suspense>
  );
}
