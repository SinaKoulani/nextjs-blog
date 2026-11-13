import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import type { PostsControllerFindPublishedParams } from "@/api/generated/nestBlogApi.schemas";
import { fetchPublishedPosts } from "@/api/services/public/posts.service";
import {
  fetchPublicCategories,
  fetchPublicTags,
} from "@/api/services/public/taxonomy.service";

export const metadata: Metadata = {
  title: "Posts",
  description: "Browse all published blog posts.",
};

type SearchParams = Record<string, string | string[] | undefined>;

const SORT_OPTIONS = [
  {
    value: "newest",
    label: "Newest first",
    sortBy: "createdAt",
    sortOrder: "DESC",
  },
  {
    value: "oldest",
    label: "Oldest first",
    sortBy: "createdAt",
    sortOrder: "ASC",
  },
  {
    value: "updated",
    label: "Recently updated",
    sortBy: "updatedAt",
    sortOrder: "DESC",
  },
  {
    value: "title-asc",
    label: "Title A to Z",
    sortBy: "title",
    sortOrder: "ASC",
  },
  {
    value: "title-desc",
    label: "Title Z to A",
    sortBy: "title",
    sortOrder: "DESC",
  },
] as const;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function toId(value: string | undefined): number | undefined {
  if (!value) {
    return undefined;
  }

  const id = Number(value);

  return Number.isInteger(id) && id > 0 ? id : undefined;
}

function parseFilters(params: SearchParams) {
  const search = first(params.search)?.trim() || undefined;
  const searchTooLong = (search?.length ?? 0) > 100;
  const categoryId = toId(first(params.categoryId));
  const tagId = toId(first(params.tagId));
  const sort = SORT_OPTIONS.find(
    (option) => option.value === first(params.sort),
  );

  const query: PostsControllerFindPublishedParams = {};

  if (search && !searchTooLong) {
    query.search = search;
  }

  if (categoryId) {
    query.categoryId = categoryId;
  }

  if (tagId) {
    query.tagId = tagId;
  }

  if (sort) {
    query.sortBy = sort.sortBy;
    query.sortOrder = sort.sortOrder;
  }

  return {
    search,
    searchTooLong,
    categoryId,
    tagId,
    sortValue: sort?.value ?? "",
    query,
    hasFilters: Object.keys(query).length > 0 || Boolean(search),
  };
}

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

async function PostsContent({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await connection();

  const filters = parseFilters(await searchParams);

  const [postsResult, categoriesResult, tagsResult] = await Promise.all([
    filters.searchTooLong ? Promise.resolve(null) : fetchPublishedPosts(filters.query),
    fetchPublicCategories(),
    fetchPublicTags(),
  ]);

  const categories = categoriesResult.isOK ? categoriesResult.data : [];
  const tags = tagsResult.isOK ? tagsResult.data : [];

  return (
    <>
      <form
        method="get"
        className="mt-8 grid gap-3 rounded-2xl border border-border bg-card p-4 md:grid-cols-2"
      >
        <input
          name="search"
          defaultValue={filters.search ?? ""}
          maxLength={100}
          placeholder="Search posts..."
          aria-label="Search posts"
          className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring md:col-span-2"
        />

        {categories.length > 0 ? (
          <select
            name="categoryId"
            defaultValue={filters.categoryId?.toString() ?? ""}
            aria-label="Category"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        ) : null}

        {tags.length > 0 ? (
          <select
            name="tagId"
            defaultValue={filters.tagId?.toString() ?? ""}
            aria-label="Tag"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">All tags</option>
            {tags.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.name}
              </option>
            ))}
          </select>
        ) : null}

        <select
          name="sort"
          defaultValue={filters.sortValue}
          aria-label="Sort order"
          className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">Default order</option>
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background"
          >
            Apply
          </button>

          {filters.hasFilters ? (
            <Link
              href="/posts"
              className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              Clear
            </Link>
          ) : null}
        </div>
      </form>

      {filters.searchTooLong ? (
        <p role="alert" className="mt-6 text-sm text-destructive">
          Search must be 100 characters or fewer.
        </p>
      ) : !postsResult?.isOK ? (
        <p role="alert" className="mt-6 text-sm text-destructive">
          {postsResult?.error.displayMessage}
        </p>
      ) : postsResult.data.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">
          {filters.hasFilters
            ? "No posts match your filters."
            : "No posts yet."}
        </p>
      ) : (
        <ul className="mt-10 space-y-4">
          {postsResult.data.map((post) => {
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
    </>
  );
}

export default function PostsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col px-6 py-16">
      <h1 className="text-4xl font-semibold tracking-tight">Posts</h1>

      <Suspense
        fallback={
          <p className="mt-6 text-sm text-muted-foreground">Loading posts...</p>
        }
      >
        <PostsContent searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
