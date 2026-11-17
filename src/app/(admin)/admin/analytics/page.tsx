"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  fetchAnalyticsOverview,
  fetchPostAnalytics,
  getPostViewCount,
} from "@/api/services/admin/analytics.service";
import { fetchPublishedPosts } from "@/api/services/public/posts.service";
import type { Post } from "@/types/post.type";

type AnalyticsOverview = Record<string, unknown>;
type PublishedPostAnalytics = {
  post: Post;
  views: number | null;
  error: string | null;
};

function isAnalyticsOverview(value: unknown): value is AnalyticsOverview {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getNumber(data: AnalyticsOverview, ...keys: string[]): number {
  for (const key of keys) {
    const value = data[key];

    if (typeof value === "number") {
      return value;
    }
  }

  return 0;
}

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [publishedPosts, setPublishedPosts] = useState<
    PublishedPostAnalytics[]
  >([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [postsError, setPostsError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadAnalytics() {
      const [overviewResponse, postsResponse] = await Promise.all([
        fetchAnalyticsOverview(),
        fetchPublishedPosts({ sortBy: "createdAt", sortOrder: "DESC" }),
      ]);

      if (cancelled) {
        return;
      }

      if (!overviewResponse.isOK) {
        setError(overviewResponse.error.displayMessage);
        setIsLoading(false);
      } else if (!isAnalyticsOverview(overviewResponse.data)) {
        setError("Unexpected response shape from GET /analytics/overview");
        setIsLoading(false);
      } else {
        setAnalytics(overviewResponse.data);
        setIsLoading(false);
      }

      if (!postsResponse.isOK) {
        setPostsError(postsResponse.error.displayMessage);
        setIsLoadingPosts(false);
        return;
      }

      const rows = await Promise.all(
        postsResponse.data
          .filter((post) => post.isPublished)
          .map(async (post): Promise<PublishedPostAnalytics> => {
            const response = await fetchPostAnalytics(post.id);

            if (!response.isOK) {
              return {
                post,
                views: null,
                error: response.error.displayMessage,
              };
            }

            return {
              post,
              views: getPostViewCount(response.data),
              error: null,
            };
          }),
      );

      if (!cancelled) {
        setPublishedPosts(rows);
        setIsLoadingPosts(false);
      }
    }

    void loadAnalytics();

    return () => {
      cancelled = true;
    };
  }, []);

  const totalViews = analytics
    ? getNumber(analytics, "totalViews", "views")
    : 0;

  const totalPosts = analytics
    ? getNumber(analytics, "totalPosts", "posts")
    : 0;

  const totalUsers = analytics
    ? getNumber(analytics, "totalUsers", "users")
    : 0;

  const totalCategories = analytics
    ? getNumber(analytics, "totalCategories", "categories")
    : 0;

  const totalTags = analytics
    ? getNumber(analytics, "totalTags", "tags")
    : 0;

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[#d7dae0]">
          Analytics
        </h1>

        <p className="mt-1 text-sm text-[#828997]">
          Overview of your content and users.
        </p>
      </div>

      {isLoading && (
        <div className="rounded-2xl border border-[#3e4451] bg-[#21252b] p-8 text-center text-sm text-[#828997]">
          Loading analytics...
        </div>
      )}

      {!isLoading && error && (
        <div className="rounded-2xl border border-[#3e4451] bg-[#21252b] p-8 text-center">
          <p className="text-sm text-[#d19a66]">{error}</p>
        </div>
      )}

      {!isLoading && !error && analytics && (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnalyticsCard title="Total Views" value={totalViews} />
          <AnalyticsCard title="Total Posts" value={totalPosts} />
          <AnalyticsCard title="Users" value={totalUsers} />
          <AnalyticsCard
            title="Categories"
            value={totalCategories}
            href="/admin/categories"
          />
          <AnalyticsCard
            title="Tags"
            value={totalTags}
            href="/admin/tags"
          />
        </section>
      )}

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-[#d7dae0]">
            Published posts
          </h2>
          <p className="mt-1 text-sm text-[#828997]">
            View post performance and open detailed analytics.
          </p>
        </div>

        {isLoadingPosts ? (
          <div className="rounded-2xl border border-[#3e4451] bg-[#21252b] p-8 text-center text-sm text-[#828997]">
            Loading published posts...
          </div>
        ) : postsError ? (
          <p
            role="alert"
            className="rounded-2xl border border-[#3e4451] bg-[#21252b] p-6 text-sm text-[#d19a66]"
          >
            {postsError}
          </p>
        ) : publishedPosts.length === 0 ? (
          <div className="rounded-2xl border border-[#3e4451] bg-[#21252b] p-8 text-center text-sm text-[#828997]">
            No published posts found.
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-[#3e4451] bg-[#21252b] shadow-lg shadow-black/20">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-[#3e4451] bg-white/[0.03]">
                  <tr>
                    <th className="px-4 py-3 font-medium text-[#828997]">
                      Post
                    </th>
                    <th className="px-4 py-3 font-medium text-[#828997]">
                      Published
                    </th>
                    <th className="px-4 py-3 font-medium text-[#828997]">
                      Views
                    </th>
                    <th className="px-4 py-3 font-medium text-[#828997]">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#3e4451]">
                  {publishedPosts.map(({ post, views, error: viewError }) => (
                    <tr
                      key={post.id}
                      className="transition-colors hover:bg-[#282c34]"
                    >
                      <td className="px-4 py-4">
                        <Link
                          href={`/admin/analytics/posts/${post.id}`}
                          className="font-medium text-[#d7dae0] hover:text-[#d19a66] hover:underline"
                        >
                          {post.title}
                        </Link>
                      </td>
                      <td className="px-4 py-4 text-xs text-[#828997]">
                        {new Date(post.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-4 text-xs text-[#abb2bf]">
                        {viewError ? (
                          <span title={viewError}>Unavailable</span>
                        ) : views === null ? (
                          "Unavailable"
                        ) : (
                          views.toLocaleString()
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <Link
                          href={`/admin/analytics/posts/${post.id}`}
                          className="text-xs font-medium text-[#d19a66] hover:text-[#e5ad7b] hover:underline"
                        >
                          View analytics
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function AnalyticsCard({
  title,
  value,
  href,
}: {
  title: string;
  value: number;
  href?: string;
}) {
  const content = (
    <>
      <div className="mb-5 h-1 w-9 rounded-full bg-[#d19a66]/80" />

      <p className="text-sm text-[#828997]">{title}</p>

      <p className="mt-2 text-3xl font-semibold tracking-tight text-[#d7dae0]">
        {value}
      </p>
    </>
  );

  const className =
    "block rounded-2xl border border-[#3e4451] bg-[#21252b] p-5 transition-colors hover:border-[#d19a66]/50";

  return href ? (
    <Link href={href} className={className}>
      {content}
      <span className="mt-4 block text-xs font-medium text-[#d19a66]">
        Manage {title.toLowerCase()} →
      </span>
    </Link>
  ) : (
    <div className={className}>{content}</div>
  );
}
