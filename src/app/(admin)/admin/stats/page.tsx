import { mockAdminCategories } from "@/mock/admin/categories";
import { mockAdminPosts } from "@/mock/admin/posts";
import { mockAdminTags } from "@/mock/admin/tags";
import { mockAdminUsers } from "@/mock/admin/users";

export default function AdminStatsPage() {
  const publishedPosts = mockAdminPosts.filter((post) => post.isPublished).length;
  const draftPosts = mockAdminPosts.length - publishedPosts;
  const categoryAssignments = mockAdminPosts.reduce(
    (total, post) => total + post.categoryIds.length,
    0,
  );
  const tagAssignments = mockAdminPosts.reduce(
    (total, post) => total + post.tagIds.length,
    0,
  );

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[#d7dae0]">Statistics</h1>
        <p className="mt-1 text-sm text-[#828997]">
          Overview of your content and users.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard title="Total Posts" value={mockAdminPosts.length} />
        <StatsCard title="Published Posts" value={publishedPosts} />
        <StatsCard title="Draft Posts" value={draftPosts} />
        <StatsCard title="Categories" value={mockAdminCategories.length} />
        <StatsCard title="Tags" value={mockAdminTags.length} />
        <StatsCard title="Users" value={mockAdminUsers.length} />
        <StatsCard title="Category Assignments" value={categoryAssignments} />
        <StatsCard title="Tag Assignments" value={tagAssignments} />
      </section>
    </div>
  );
}

function StatsCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-2xl border border-[#3e4451] bg-[#21252b] p-5 transition-colors hover:border-[#d19a66]/50">
      <div className="mb-5 h-1 w-9 rounded-full bg-[#d19a66]/80" />
      <p className="text-sm text-[#828997]">{title}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-[#d7dae0]">{value}</p>
    </div>
  );
}
