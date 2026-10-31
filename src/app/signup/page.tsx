"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { SignupForm } from "@/components/shadcn/signup-form";
import { signupSchema } from "@/lib/validations/auth-test";
import { getAuth } from "@/api/generated/auth/auth";
import { safeCall } from "@/api/err/safe-call";

const { authControllerRegister } = getAuth();

/**
 * Signup page.
 * Form values are validated with zod (src/lib/validations/auth-test.ts),
 * then sent through the generated Orval client.
 * API errors are handled by safeCall and appHttpErr (src/api/err/).
 */
export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const validation = signupSchema.safeParse({
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirm-password"),
    });

    if (!validation.success) {
      setError(validation.error.issues[0]?.message ?? "Invalid form data");
      setIsSubmitting(false);
      return;
    }

    const { firstName, lastName, email, password } = validation.data;

    const result = await safeCall(() =>
      authControllerRegister({ firstName, lastName, email, password }),
    );
    setIsSubmitting(false);

    if (!result.isOK) {
      setError(
        result.error.statusCode === 409
          ? "An account with this email already exists."
          : result.error.displayMessage,
      );
      return;
    }

    router.push("/login");
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