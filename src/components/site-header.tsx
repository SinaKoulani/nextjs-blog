"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { LogoutButton } from "@/components/logout-button";
import { AUTH_CHANGE_EVENT, getToken } from "@/api/auth.token";

type AuthStatus = "checking" | "authed" | "guest";

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(AUTH_CHANGE_EVENT, onChange);

  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(AUTH_CHANGE_EVENT, onChange);
  };
}

function getSnapshot(): AuthStatus {
  return getToken() ? "authed" : "guest";
}

// The server cannot read localStorage, so render a neutral state first.
function getServerSnapshot(): AuthStatus {
  return "checking";
}

export function SiteHeader() {
  const status = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Northstar Journal
        </Link>

        <nav className="flex items-center gap-6 text-sm text-muted-foreground">
          <Link href="/">Home</Link>
          <Link href="/posts">Posts</Link>
          {status === "authed" ? <Link href="/profile">Profile</Link> : null}
        </nav>

        <div className="flex items-center gap-3">
          {status === "authed" ? <LogoutButton /> : null}

          {status === "guest" ? (
            <>
              <Link
                href="/login"
                className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="inline-flex rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background"
              >
                Join now
              </Link>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}
