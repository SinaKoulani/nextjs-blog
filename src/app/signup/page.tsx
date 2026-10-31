
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { SignupForm } from "@/components/shadcn/signup-form";
import { signupSchema } from "@/lib/validations/auth-test";
import { getAuth } from "@/api/generated/auth/auth";
import { safeCall } from "@/api/err/safe-call";

export default function SignupPage() {
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

      const payload = {
        firstName: String(formData.get("firstName") ?? ""),
        lastName: String(formData.get("lastName") ?? ""),
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
        confirmPassword: String(formData.get("confirm-password") ?? ""),
      };

      const validation = signupSchema.safeParse(payload);

      if (!validation.success) {
        setError(validation.error.issues[0]?.message ?? "Invalid form data");
        return;
      }

      const { confirmPassword, ...registerDto } = validation.data;

      const result = await safeCall(() =>
        getAuth().authControllerRegister(registerDto)
      );

      if (!result.isOK) {
        setError(result.error.displayMessage);
        return;
      }

      router.push("/login");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <SignupForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          error={error}
        />
      </div>
    </div>
  );
}
