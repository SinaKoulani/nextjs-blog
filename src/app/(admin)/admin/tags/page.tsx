import { mockAdminTags } from "@/mock/admin/tags";

export default function AdminTagsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#d7dae0]">Tags</h1>
          <p className="mt-1 text-sm text-[#828997]">
            Manage your blog tags.
          </p>
        </div>

        <button
          type="button"
          className="rounded-lg bg-[#d19a66] px-4 py-2.5 text-sm font-semibold text-[#282c34] transition-colors hover:bg-[#e5ad7b]"
        >
          New Tag
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#3e4451] bg-[#21252b] shadow-lg shadow-black/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[#3e4451] bg-white/[0.03]">
              <tr>
                <th className="px-4 py-3 font-medium text-[#828997]">Name</th>
                <th className="px-4 py-3 font-medium text-[#828997]">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#3e4451]">
              {mockAdminTags.map((tag) => (
                <tr key={tag.id} className="transition-colors hover:bg-[#282c34]">
                  <td className="px-4 py-4 font-medium text-[#abb2bf]">{tag.name}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
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
