import Link from "next/link";
import { mockAdminPosts } from "@/mock/admin/posts";

export default function AdminPostsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Posts</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your blog posts.
          </p>
        </div>

        <Link
          href="/admin/posts/new"
          className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background"
        >
          New Post
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-muted/40">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Categories</th>
                <th className="px-4 py-3 font-medium">Tags</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {mockAdminPosts.map((post) => (
                <tr key={post.id}>
                  <td className="px-4 py-4">
                    <p className="font-medium">{post.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {post.slug}
                    </p>
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={
                        post.isPublished
                          ? "text-xs font-medium text-foreground"
                          : "text-xs font-medium text-muted-foreground"
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
                          className="rounded-md border px-2 py-1 text-xs"
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
                          className="rounded-md border px-2 py-1 text-xs"
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
                        className="text-xs font-medium hover:underline"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="text-xs font-medium text-muted-foreground hover:text-foreground"
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
