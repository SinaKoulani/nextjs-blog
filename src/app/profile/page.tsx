"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RequireAuth } from "@/components/require-auth";
import { LogoutButton } from "@/components/logout-button";
import { fetchMyProfile } from "@/api/services/user.service";
import { clearToken } from "@/api/auth.token";
import type { User } from "@/types/user.type";

type ProfileState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; user: User };

function getInitials(user: User): string {
  const first = (user.firstName ?? "").charAt(0);
  const last = (user.lastName ?? "").charAt(0);

  return `${first}${last}`.toUpperCase() || "?";
}

function getName(user: User): string {
  return (
    user.displayName ||
    `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() ||
    user.email
  );
}

function ProfileContent() {
  const router = useRouter();
  const [state, setState] = useState<ProfileState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    fetchMyProfile().then((result) => {
      if (cancelled) {
        return;
      }

      if (result.isOK) {
        setState({ status: "ready", user: result.data });
        return;
      }

      if (result.error.statusCode === 401) {
        clearToken();
        router.replace("/login");
        return;
      }

      setState({ status: "error", message: result.error.displayMessage });
    });

    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col px-6 py-16">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
            Member profile
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">
            {state.status === "ready"
              ? `Welcome back, ${state.user.firstName ?? getName(state.user)}`
              : "Profile"}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="rounded-full border border-border px-4 py-2 text-sm font-medium"
          >
            Back to home
          </Link>
          <Link
            href="/profile/password"
            className="rounded-full border border-border px-4 py-2 text-sm font-medium"
          >
            Change password
          </Link>
          <LogoutButton />
        </div>
      </div>

      {state.status === "loading" ? (
        <p className="text-sm text-muted-foreground">Loading your profile...</p>
      ) : null}

      {state.status === "error" ? (
        <p role="alert" className="text-sm text-red-700">
          {state.message}
        </p>
      ) : null}

      {state.status === "ready" ? (
        <section className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-foreground text-lg font-semibold text-background">
            {getInitials(state.user)}
          </div>
          <h2 className="text-xl font-semibold">{getName(state.user)}</h2>
          {state.user.bio ? (
            <p className="mt-2 text-sm text-muted-foreground">
              {state.user.bio}
            </p>
          ) : null}
          <div className="mt-6 space-y-3 text-sm text-muted-foreground">
            <p>{state.user.email}</p>
            {state.user.phone ? <p>{state.user.phone}</p> : null}
            {state.user.website ? <p>{state.user.website}</p> : null}
          </div>
        </section>
      ) : null}
    </main>
  );
}

export default function ProfilePage() {
  return (
    <RequireAuth>
      <ProfileContent />
    </RequireAuth>
  );
}
