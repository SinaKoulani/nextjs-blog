"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/shadcn/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/shadcn/ui/field";
import { Input } from "@/components/shadcn/ui/input";
import { updateMyProfile } from "@/api/services/public/profile.service";
import { clearToken } from "@/api/auth.token";
import { profileSchema } from "@/lib/validations/profile-test";
import type { UpdateMyProfileDto } from "@/api/generated/nestBlogApi.schemas";
import type { User } from "@/types/user.type";

type Props = {
  user: User;
  onSavedAction: () => void;
  onCancelAction: () => void;
};

const FIELDS = [
  "firstName",
  "lastName",
  "email",
  "displayName",
  "bio",
  "phone",
  "website",
] as const;
type FieldName = (typeof FIELDS)[number];

export function ProfileEditForm({
  user,
  onSavedAction,
  onCancelAction,
}: Props) {
  const router = useRouter();
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);

    const data = new FormData(e.currentTarget);
    const raw = Object.fromEntries(
      FIELDS.map((name) => [name, String(data.get(name) ?? "")]),
    );

    const parsed = profileSchema.safeParse(raw);
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

    const payload: UpdateMyProfileDto = {};
    for (const name of FIELDS) {
      const value = parsed.data[name];
      const current = user[name] ?? "";
      if (value !== current) {
        payload[name] = value;
      }
    }

    if (Object.keys(payload).length === 0) {
      onCancelAction();
      return;
    }

    setIsSubmitting(true);
    const result = await updateMyProfile(payload);
    setIsSubmitting(false);

    if (!result.isOK) {
      if (result.error.statusCode === 401) {
        clearToken();
        router.replace("/login");
        return;
      }
      setFormError(result.error.displayMessage);
      return;
    }

    onSavedAction();
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

        <Field className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="firstName">First name</FieldLabel>
            <Input
              id="firstName"
              name="firstName"
              defaultValue={user.firstName}
              maxLength={100}
            />
            {errors.firstName ? (
              <p className="text-sm text-destructive">{errors.firstName}</p>
            ) : null}
          </Field>
          <Field>
            <FieldLabel htmlFor="lastName">Last name</FieldLabel>
            <Input
              id="lastName"
              name="lastName"
              defaultValue={user.lastName}
              maxLength={100}
            />
            {errors.lastName ? (
              <p className="text-sm text-destructive">{errors.lastName}</p>
            ) : null}
          </Field>
        </Field>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            defaultValue={user.email}
          />
          {errors.email ? (
            <p className="text-sm text-destructive">{errors.email}</p>
          ) : null}
        </Field>

        <Field>
          <FieldLabel htmlFor="displayName">Display name</FieldLabel>
          <Input
            id="displayName"
            name="displayName"
            defaultValue={user.displayName ?? ""}
            maxLength={100}
          />
          {errors.displayName ? (
            <p className="text-sm text-destructive">{errors.displayName}</p>
          ) : null}
        </Field>

        <Field>
          <FieldLabel htmlFor="bio">Bio</FieldLabel>
          <textarea
            id="bio"
            name="bio"
            rows={4}
            defaultValue={user.bio ?? ""}
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          />
          {errors.bio ? (
            <p className="text-sm text-destructive">{errors.bio}</p>
          ) : null}
        </Field>

        <Field className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="phone">Phone</FieldLabel>
            <Input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              defaultValue={user.phone ?? ""}
            />
            {errors.phone ? (
              <p className="text-sm text-destructive">{errors.phone}</p>
            ) : null}
          </Field>
          <Field>
            <FieldLabel htmlFor="website">Website</FieldLabel>
            <Input
              id="website"
              name="website"
              defaultValue={user.website ?? ""}
              placeholder="https://"
            />
            {errors.website ? (
              <p className="text-sm text-destructive">{errors.website}</p>
            ) : null}
          </Field>
        </Field>

        <Field className="flex flex-row gap-3">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save changes"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancelAction}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
