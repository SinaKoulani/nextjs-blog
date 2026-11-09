import { mockAdminCategories } from "@/mock/admin/categories";
import { mockAdminPosts } from "@/mock/admin/posts";
import { mockAdminTags } from "@/mock/admin/tags";
import { mockAdminUsers } from "@/mock/admin/users";

export default function AdminPage() {
  const publishedPosts = mockAdminPosts.filter((post) => post.isPublished).length;
  const draftPosts = mockAdminPosts.filter((post) => !post.isPublished).length;

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
        <p className="mt-2 text-sm text-[#828997]">
          Overview of your blog.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard title="Total Posts" value={mockAdminPosts.length} />
        <DashboardCard title="Published" value={publishedPosts} />
        <DashboardCard title="Drafts" value={draftPosts} />
        <DashboardCard title="Users" value={mockAdminUsers.length} />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-[#3e4451] bg-[#21252b] p-6 shadow-lg shadow-black/20">
          <h2 className="text-sm font-semibold text-[#d7dae0]">Content</h2>

          <div className="mt-5 grid grid-cols-2 gap-4">
            <div>
              <p className="text-2xl font-semibold text-[#d19a66]">{mockAdminCategories.length}</p>
              <p className="text-sm text-[#828997]">Categories</p>
            </div>

            <div>
              <p className="text-2xl font-semibold text-[#d19a66]">{mockAdminTags.length}</p>
              <p className="text-sm text-[#828997]">Tags</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#3e4451] bg-[#21252b] p-6 shadow-lg shadow-black/20">
          <h2 className="text-sm font-semibold text-[#d7dae0]">Recent Posts</h2>

          <div className="mt-4 space-y-3">
            {mockAdminPosts.slice(0, 5).map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between gap-4 border-b border-[#3e4451] pb-3 last:border-0 last:pb-0"
              >
                <p className="truncate text-sm font-medium text-[#abb2bf]">{post.title}</p>

                <span
                  className={`shrink-0 text-xs ${
                    post.isPublished
                      ? "text-[#d19a66]"
                      : "text-[#828997]"
                  }`}
                >
                  {post.isPublished ? "Published" : "Draft"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function DashboardCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="group rounded-2xl border border-[#3e4451] bg-[#21252b] p-5 transition-colors hover:border-[#d19a66]/50">
      <div className="mb-5 h-1 w-9 rounded-full bg-[#d19a66]/80 transition-all group-hover:w-14" />
      <p className="text-sm text-[#828997]">{title}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-[#d7dae0]">{value}</p>
    </div>
  );
}
