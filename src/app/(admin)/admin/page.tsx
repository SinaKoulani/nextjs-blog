"use client";

import { useEffect, useState } from "react";
import { fetchAdminPosts } from "@/api/services/admin/posts.service";
import { fetchCategories } from "@/api/services/admin/categories.service";
import { fetchTags } from "@/api/services/admin/tags.service";
import { fetchUsers } from "@/api/services/admin/users.service";
import type { Post } from "@/types/post.type";

export default function AdminPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [usersCount, setUsersCount] = useState(0);
  const [categoriesCount, setCategoriesCount] = useState(0);
  const [tagsCount, setTagsCount] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      const [postsResponse, usersResponse, categoriesResponse, tagsResponse] =
        await Promise.all([
          fetchAdminPosts(),
          fetchUsers(),
          fetchCategories(),
          fetchTags(),
        ]);

      if (!postsResponse.isOK) {
        setError(postsResponse.error.displayMessage);
        setIsLoading(false);
        return;
      }

      if (!usersResponse.isOK) {
        setError(usersResponse.error.displayMessage);
        setIsLoading(false);
        return;
      }

      if (!categoriesResponse.isOK) {
        setError(categoriesResponse.error.displayMessage);
        setIsLoading(false);
        return;
      }

      if (!tagsResponse.isOK) {
        setError(tagsResponse.error.displayMessage);
        setIsLoading(false);
        return;
      }

      setPosts(postsResponse.data);
      setUsersCount(usersResponse.data.length);
      setCategoriesCount(categoriesResponse.data.length);
      setTagsCount(tagsResponse.data.length);
      setIsLoading(false);
    }

    loadDashboard();
  }, []);

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="relative overflow-hidden rounded-2xl border border-[#3e4451] bg-gradient-to-br from-[#323842] via-[#282c34] to-[#21252b] p-7 md:p-9">
        <div className="absolute -right-12 -top-20 h-56 w-56 rounded-full bg-[#d19a66]/10 blur-3xl" />

        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#d19a66]">
          Control center
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#d7dae0] md:text-4xl">
          Dashboard
        </h1>

        <p className="mt-2 text-sm text-[#828997]">Overview of your blog.</p>
      </div>

      {isLoading && (
        <div className="rounded-2xl border border-[#3e4451] bg-[#21252b] p-8 text-center text-sm text-[#828997]">
          Loading dashboard...
        </div>
      )}

      {!isLoading && error && (
        <div className="rounded-2xl border border-[#3e4451] bg-[#21252b] p-8 text-center">
          <p className="text-sm text-[#d19a66]">{error}</p>
        </div>
      )}

      {!isLoading && !error && (
        <>
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <DashboardCard title="Total Posts" value={posts.length} />
            <DashboardCard title="Users" value={usersCount} />
            <DashboardCard title="Categories" value={categoriesCount} />
            <DashboardCard title="Tags" value={tagsCount} />
          </section>

          <section>
            <div className="rounded-2xl border border-[#3e4451] bg-[#21252b] p-6 shadow-lg shadow-black/20">
              <h2 className="text-sm font-semibold text-[#d7dae0]">
                Recent Posts
              </h2>

              <div className="mt-4 space-y-3">
                {posts.length === 0 ? (
                  <p className="text-sm text-[#828997]">No posts found.</p>
                ) : (
                  posts.slice(0, 5).map((post) => (
                    <div
                      key={post.id}
                      className="flex items-center justify-between gap-4 border-b border-[#3e4451] pb-3 last:border-0 last:pb-0"
                    >
                      <p className="truncate text-sm font-medium text-[#abb2bf]">
                        {post.title}
                      </p>

                      <span className="shrink-0 text-xs text-[#828997]">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function DashboardCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="group rounded-2xl border border-[#3e4451] bg-[#21252b] p-5 transition-colors hover:border-[#d19a66]/50">
      <div className="mb-5 h-1 w-9 rounded-full bg-[#d19a66]/80 transition-all group-hover:w-14" />

      <p className="text-sm text-[#828997]">{title}</p>

      <p className="mt-2 text-3xl font-semibold tracking-tight text-[#d7dae0]">
        {value}
      </p>
    </div>
  );
}
