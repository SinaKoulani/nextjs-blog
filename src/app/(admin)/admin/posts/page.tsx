"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  deletePost,
  fetchAdminPosts,
} from "@/api/services/admin/posts.service";
import type { Post } from "@/types/post.type";

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingPostId, setDeletingPostId] = useState<number | null>(null);

  useEffect(() => {
    async function loadPosts() {
      const response = await fetchAdminPosts();

      if (!response.isOK) {
        setError(response.error.displayMessage);
        setIsLoading(false);
        return;
      }

      setPosts(response.data);
      setIsLoading(false);
    }

    loadPosts();
  }, []);

  async function handleDelete(postId: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?",
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setDeletingPostId(postId);

    const response = await deletePost(postId);

    if (!response.isOK) {
      setError(response.error.displayMessage);
      setDeletingPostId(null);
      return;
    }

    setPosts((currentPosts) =>
      currentPosts.filter((post) => post.id !== postId),
    );

    setDeletingPostId(null);
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#d7dae0]">
            Posts
          </h1>

          <p className="mt-1 text-sm text-[#828997]">
            Manage your blog posts.
          </p>
        </div>

        <Link
          href="/admin/posts/new"
          className="rounded-lg bg-[#d19a66] px-4 py-2.5 text-sm font-semibold text-[#282c34] transition-colors hover:bg-[#e5ad7b]"
        >
          New Post
        </Link>
      </div>

      {isLoading && (
        <div className="rounded-2xl border border-[#3e4451] bg-[#21252b] p-8 text-center text-sm text-[#828997]">
          Loading posts...
        </div>
      )}

      {!isLoading && error && (
        <div className="rounded-2xl border border-[#3e4451] bg-[#21252b] p-8 text-center">
          <p className="text-sm text-[#d19a66]">{error}</p>
        </div>
      )}

      {!isLoading && !error && posts.length === 0 && (
        <div className="rounded-2xl border border-[#3e4451] bg-[#21252b] p-8 text-center">
          <p className="text-sm text-[#828997]">
            No posts found.
          </p>
        </div>
      )}

      {!isLoading && !error && posts.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-[#3e4451] bg-[#21252b] shadow-lg shadow-black/20">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[#3e4451] bg-white/[0.03]">
                <tr>
                  <th className="px-4 py-3 font-medium text-[#828997]">
                    Title
                  </th>

                  <th className="px-4 py-3 font-medium text-[#828997]">
                    Slug
                  </th>

                  <th className="px-4 py-3 font-medium text-[#828997]">
                    Created
                  </th>

                  <th className="px-4 py-3 font-medium text-[#828997]">
                    Updated
                  </th>

                  <th className="px-4 py-3 font-medium text-[#828997]">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#3e4451]">
                {posts.map((post) => (
                  <tr
                    key={post.id}
                    className="transition-colors hover:bg-[#282c34]"
                  >
                    <td className="px-4 py-4">
                      <p className="font-medium text-[#abb2bf]">
                        {post.title}
                      </p>

                      {post.excerpt && (
                        <p className="mt-1 max-w-md truncate text-xs text-[#5c6370]">
                          {post.excerpt}
                        </p>
                      )}
                    </td>

                    <td className="px-4 py-4 text-xs text-[#828997]">
                      {post.slug}
                    </td>

                    <td className="px-4 py-4 text-xs text-[#828997]">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-4 text-xs text-[#828997]">
                      {new Date(post.updatedAt).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/posts/${post.id}/edit`}
                          className="text-xs font-medium text-[#d19a66] hover:text-[#e5ad7b] hover:underline"
                        >
                          Edit
                        </Link>

                        <button
                          type="button"
                          disabled={deletingPostId === post.id}
                          onClick={() => handleDelete(post.id)}
                          className="text-xs font-medium text-[#828997] hover:text-[#abb2bf] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {deletingPostId === post.id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}