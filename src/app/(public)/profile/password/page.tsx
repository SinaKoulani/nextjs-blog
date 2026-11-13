"use client";

import Link from "next/link";
import { RequireAuth } from "@/components/require-auth";
import { LogoutButton } from "@/components/logout-button";
import { ChangePasswordForm } from "@/components/change-password-form";

export default function ChangePasswordPage() {
  return (
    <RequireAuth>
      <main className="mx-auto flex min-h-screen max-w-xl flex-col px-6 py-16">
        <div className="mb-10 flex items-center justify-between">
          <h1 className="text-3xl font-semibold tracking-tight">
            Change password
          </h1>
          <div className="flex items-center gap-3">
            <Link
              href="/profile"
              className="rounded-full border border-border px-4 py-2 text-sm font-medium"
            >
              Back to profile
            </Link>
            <LogoutButton />
          </div>
        </div>
        <section className="rounded-2xl border border-border bg-card p-6">
          <ChangePasswordForm />
        </section>
      </main>
    </RequireAuth>
  );
}
