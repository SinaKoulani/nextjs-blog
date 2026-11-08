"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/shadcn/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/shadcn/ui/field";
import { Input } from "@/components/shadcn/ui/input";
import { changeMyPassword } from "@/api/services/auth.service";
import { changePasswordSchema } from "@/lib/validations/password-test";

const FIELDS = [
  "currentPassword",
  "newPassword",
  "confirmNewPassword",
] as const;
type FieldName = (typeof FIELDS)[number];

export function ChangePasswordForm() {
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    setFormError(null);
    setSuccess(false);

    const data = new FormData(formEl);
    const raw = Object.fromEntries(
      FIELDS.map((name) => [name, String(data.get(name) ?? "")]),
    );

    const parsed = changePasswordSchema.safeParse(raw);
    if (!parsed.success) {
      const next: Partial<Record<FieldName, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as FieldName;
        next[key] ??= issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});

    setIsSubmitting(true);
    const result = await changeMyPassword({
      currentPassword: parsed.data.currentPassword,
      newPassword: parsed.data.newPassword,
    });
    setIsSubmitting(false);

    if (!result.isOK) {
      if (result.error.statusCode === 401) {
        setErrors({ currentPassword: "Current password is incorrect" });
        return;
      }
      setFormError(result.error.displayMessage);
      return;
    }

    formEl.reset();
    setSuccess(true);
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <FieldGroup>
        {formError ? (
          <div
            role="alert"
            className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {formError}
          </div>
        ) : null}
        {success ? (
          <div
            role="status"
            className="rounded-md border border-border bg-muted px-3 py-2 text-sm"
          >
            Password changed successfully.
          </div>
        ) : null}

        <Field>
          <FieldLabel htmlFor="currentPassword">Current password</FieldLabel>
          <Input
            id="currentPassword"
            name="currentPassword"
            type="password"
            autoComplete="current-password"
          />
          {errors.currentPassword ? (
            <p className="text-sm text-destructive">{errors.currentPassword}</p>
          ) : null}
        </Field>

        <Field>
          <FieldLabel htmlFor="newPassword">New password</FieldLabel>
          <Input
            id="newPassword"
            name="newPassword"
            type="password"
            autoComplete="new-password"
          />
          {errors.newPassword ? (
            <p className="text-sm text-destructive">{errors.newPassword}</p>
          ) : null}
        </Field>

        <Field>
          <FieldLabel htmlFor="confirmNewPassword">
            Confirm new password
          </FieldLabel>
          <Input
            id="confirmNewPassword"
            name="confirmNewPassword"
            type="password"
            autoComplete="new-password"
          />
          {errors.confirmNewPassword ? (
            <p className="text-sm text-destructive">
              {errors.confirmNewPassword}
            </p>
          ) : null}
        </Field>

        <Field>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Change password"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
