"use client";
import { useRouter } from "next/navigation";
import {
  AUTH_CHANGE_EVENT,
  consumeSessionExpired,
  getToken,
} from "@/api/auth.token";
import { ReactNode, useEffect, useSyncExternalStore } from "react";

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

function getServerSnapshot(): AuthStatus {
  return "checking";
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const router = useRouter();
  const status = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  useEffect(() => {
    if (status === "guest") {
      router.replace(consumeSessionExpired() ? "/login?expired=1" : "/login");
    }
  }, [status, router]);

  if (status !== "authed") {
    return null;
  }

  return <>{children}</>;
}
