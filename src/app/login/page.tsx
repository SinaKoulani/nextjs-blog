"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LoginForm } from "@/components/shadcn/login-form";
import { loginSchema } from "@/lib/validations/auth-test";
import { getAuth } from "@/api/generated/auth/auth";
import { safeCall } from "@/api/err/safe-call";
import { extractToken, setToken } from "@/api/auth.token";

const { authControllerLogin } = getAuth();

/**
 * Login page.
 * Form values are validated with zod (src/lib/validations/auth-test.ts),
 * then sent through the generated Orval client.
 * API errors are handled by safeCall and appHttpErr (src/api/err/).
 */
export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [error, setError] = useState<string | null>(() =>
    searchParams.get("expired") === "1"
      ? "Your session has expired. Please log in again."
      : null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const result = loginSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!result.success) {
      setError(result.error.issues[0].message);
      setIsSubmitting(false);
      return;
    }

    const response = await safeCall(() => authControllerLogin(result.data));
    setIsSubmitting(false);

    if (!response.isOK) {
      setError(
        response.error.statusCode === 401
          ? "Invalid email or password."
          : response.error.displayMessage,
      );
      return;
    }

    const token = extractToken(response.data as unknown);

    if (!token) {
      setError("Login succeeded, but no token was received.");
      return;
    }

    setToken(token);
    router.push("/profile");
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <LoginForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          error={error}
        />
      </div>
    </div>
  );
}
