
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/shadcn/login-form";
import { safeCall } from "@/api/err/safe-call";
import { getAuth } from "@/api/generated/auth/auth";
import { loginSchema } from "@/lib/validations/auth-test";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);


    /**
     * Validate form data with Zod.
     * API errors are handled by safeCall and appHttpErr.
     *
     * Validation schema:
     * src/lib/validations/auth-test.ts
     *
     * Error handling:
     * src/api/err/
     */
    try {
      const formData = new FormData(event.currentTarget);

      const validation = loginSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
      });

      if (!validation.success) {
        setError(
          validation.error.issues[0]?.message ?? "Invalid form data"
        );
        return;
      }

      const result = await safeCall(() =>
        getAuth().authControllerLogin(validation.data)
      );

      if (!result.isOK) {
        setError(result.error.displayMessage);
        return;
      }

      router.push("/profile");
    } finally {
      setIsSubmitting(false);
    }
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
