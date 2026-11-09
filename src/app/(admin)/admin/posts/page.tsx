import Link from "next/link";
import { mockAdminPosts } from "@/mock/admin/posts";

export default function AdminPostsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#d7dae0]">Posts</h1>
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

      <div className="overflow-hidden rounded-2xl border border-[#3e4451] bg-[#21252b] shadow-lg shadow-black/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[#3e4451] bg-white/[0.03]">
              <tr>
                <th className="px-4 py-3 font-medium text-[#828997]">Title</th>
                <th className="px-4 py-3 font-medium text-[#828997]">Status</th>
                <th className="px-4 py-3 font-medium text-[#828997]">Categories</th>
                <th className="px-4 py-3 font-medium text-[#828997]">Tags</th>
                <th className="px-4 py-3 font-medium text-[#828997]">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#3e4451]">
              {mockAdminPosts.map((post) => (
                <tr key={post.id} className="transition-colors hover:bg-[#282c34]">
                  <td className="px-4 py-4">
                    <p className="font-medium text-[#abb2bf]">{post.title}</p>
                    <p className="mt-1 text-xs text-[#5c6370]">
                      {post.slug}
                    </p>
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={
                        post.isPublished
                          ? "text-xs font-medium text-[#d19a66]"
                          : "text-xs font-medium text-[#828997]"
                      }
                    >
                      {post.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1">
                      {post.categoryIds.map((categoryId) => (
                        <span
                          key={categoryId}
                          className="rounded-md border border-[#d19a66]/20 bg-[#d19a66]/5 px-2 py-1 text-xs text-[#d19a66]"
                        >
                          {categoryId}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1">
                      {post.tagIds.map((tagId) => (
                        <span
                          key={tagId}
                          className="rounded-md border border-[#d19a66]/20 bg-[#d19a66]/5 px-2 py-1 text-xs text-[#d19a66]"
                        >
                          {tagId}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="text-xs font-medium text-[#d19a66] hover:text-[#e5ad7b] hover:underline"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="text-xs font-medium text-[#828997] hover:text-[#abb2bf]"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
