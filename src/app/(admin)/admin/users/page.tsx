import { mockAdminUsers } from "@/mock/admin/users";

export default function AdminUsersPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[#d7dae0]">Users</h1>
        <p className="mt-1 text-sm text-[#828997]">
          Manage your users.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#3e4451] bg-[#21252b] shadow-lg shadow-black/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[#3e4451] bg-white/[0.03]">
              <tr>
                <th className="px-4 py-3 font-medium text-[#828997]">Name</th>
                <th className="px-4 py-3 font-medium text-[#828997]">Email</th>
                <th className="px-4 py-3 font-medium text-[#828997]">Bio</th>
                <th className="px-4 py-3 font-medium text-[#828997]">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#3e4451]">
              {mockAdminUsers.map((user) => (
                <tr key={user.id} className="transition-colors hover:bg-[#282c34]">
                  <td className="px-4 py-4 font-medium text-[#abb2bf]">
                    {user.displayName || `${user.firstName} ${user.lastName}`}
                  </td>
                  <td className="px-4 py-4 text-[#abb2bf]">{user.email}</td>
                  <td className="px-4 py-4 text-[#828997]">
                    {user.bio || "—"}
                  </td>
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
