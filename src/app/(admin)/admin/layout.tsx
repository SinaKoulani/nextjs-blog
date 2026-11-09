import type { ReactNode } from "react";
import { RequireAuth } from "@/components/require-auth";

type AdminLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <RequireAuth>
      <div className="min-h-screen bg-[#282c34] text-[#abb2bf]">
        <div className="flex min-h-screen">
          <aside className="hidden w-64 shrink-0 border-r border-[#3e4451] bg-[#21252b] lg:block">
            <div className="flex h-16 items-center border-b border-[#3e4451] px-6">
              <span className="mr-3 h-2.5 w-2.5 rounded-full bg-[#d19a66] shadow-[0_0_16px_rgba(209,154,102,0.4)]" />
              <span className="font-semibold tracking-tight text-[#d7dae0]">
                Northstar <span className="text-[#d19a66]">Admin</span>
              </span>
            </div>

            <nav className="p-4">
              <div className="space-y-1">
                <a
                  href="/admin"
                  className="block rounded-lg px-3 py-2.5 text-sm text-[#abb2bf] transition-colors hover:bg-[#d19a66]/10 hover:text-[#d19a66]"
                >
                  Dashboard
                </a>

                <a
                  href="/admin/posts"
                  className="block rounded-lg px-3 py-2.5 text-sm text-[#abb2bf] transition-colors hover:bg-[#d19a66]/10 hover:text-[#d19a66]"
                >
                  Posts
                </a>

                <a
                  href="/admin/categories"
                  className="block rounded-lg px-3 py-2.5 text-sm text-[#abb2bf] transition-colors hover:bg-[#d19a66]/10 hover:text-[#d19a66]"
                >
                  Categories
                </a>

                <a
                  href="/admin/tags"
                  className="block rounded-lg px-3 py-2.5 text-sm text-[#abb2bf] transition-colors hover:bg-[#d19a66]/10 hover:text-[#d19a66]"
                >
                  Tags
                </a>

                <a
                  href="/admin/users"
                  className="block rounded-lg px-3 py-2.5 text-sm text-[#abb2bf] transition-colors hover:bg-[#d19a66]/10 hover:text-[#d19a66]"
                >
                  Users
                </a>

                <a
                  href="/admin/stats"
                  className="block rounded-lg px-3 py-2.5 text-sm text-[#abb2bf] transition-colors hover:bg-[#d19a66]/10 hover:text-[#d19a66]"
                >
                  Stats
                </a>
              </div>
            </nav>
          </aside>

          <div className="flex min-w-0 flex-1 flex-col">
            <header className="flex h-16 items-center border-b border-[#3e4451] bg-[#21252b] px-6">
              <h2 className="text-sm font-medium text-[#abb2bf]">Admin Panel</h2>
            </header>

            <main className="flex-1 p-6 md:p-8">{children}</main>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}
