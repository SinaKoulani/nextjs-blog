"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/shadcn/ui/button";
import { getAuth } from "@/api/generated/auth/auth";
import { safeCall } from "@/api/err/safe-call";
import { clearToken } from "@/api/auth.token";

const { authControllerLogout } = getAuth();

export function LogoutButton() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  async function handleClick() {
    setIsSubmitting(true);
    const response = await safeCall(() => authControllerLogout());

    if (!response.isOK) {
      window.alert(
        `The logout request failed: ${response.error.displayMessage} Your local session has been cleared.`,
      );
    }

    clearToken();
    router.push("/login");
  }

  return (
    <Button variant="outline" onClick={handleClick} disabled={isSubmitting}>
      {isSubmitting ? "Logging out..." : "Log out"}
    </Button>
  );
}
