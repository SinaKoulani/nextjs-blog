"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  deleteCategory,
  fetchCategory,
  updateCategory,
} from "@/api/services/admin/categories.service";

type Category = {
  id: number;
  name: string;
  description?: string | null;
};

function isCategory(value: unknown): value is Category {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const category = value as Partial<Category>;

  return (
    typeof category.id === "number" &&
    typeof category.name === "string" &&
    (category.description === undefined ||
      category.description === null ||
      typeof category.description === "string")
  );
}

export default function AdminCategoryDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [category, setCategory] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadCategory() {
      const id = Number(params.id);

      if (!Number.isInteger(id) || id <= 0) {
        setError("Invalid category ID.");
        setIsLoading(false);
        return;
      }

      const response = await fetchCategory(id);

      if (cancelled) {
        return;
      }

      if (!response.isOK) {
        setError(response.error.displayMessage);
        setIsLoading(false);
        return;
      }

      if (!isCategory(response.data)) {
        setError("Unexpected response shape from GET /categories/{id}");
        setIsLoading(false);
        return;
      }

      setCategory(response.data);
      setName(response.data.name);
      setDescription(response.data.description ?? "");
      setIsLoading(false);
    }

    void loadCategory();

    return () => {
      cancelled = true;
    };
  }, [params.id]);

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!category) {
      return;
    }

    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    setError("");
    setSuccess("");

    if (!trimmedName) {
      setError("Category name is required.");
      return;
    }

    if (trimmedName.length > 100) {
      setError("Category name is too long.");
      return;
    }

    if (trimmedDescription.length > 5000) {
      setError("Description is too long.");
      return;
    }

    setIsSaving(true);

    const response = await updateCategory(category.id, {
      name: trimmedName,
      description: trimmedDescription || null,
    });

    setIsSaving(false);

    if (!response.isOK) {
      setError(response.error.displayMessage);
      return;
    }

    setCategory({
      ...category,
      name: trimmedName,
      description: trimmedDescription || null,
    });
    setSuccess("Category updated successfully.");
  }

  async function handleDelete() {
    if (!category) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${category.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setIsDeleting(true);

    const response = await deleteCategory(category.id);

    setIsDeleting(false);

    if (!response.isOK) {
      setError(response.error.displayMessage);
      return;
    }

    router.push("/admin/categories");
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl rounded-xl border border-[#3e4451] bg-[#21252b] p-8 text-center text-sm text-[#828997]">
        Loading category...
      </div>
    );
  }

  if (!category) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <Link
          href="/admin/categories"
          className="text-sm font-medium text-[#d19a66] hover:underline"
        >
          Back to categories
        </Link>
        <p
          role="alert"
          className="rounded-xl border border-[#3e4451] bg-[#21252b] p-6 text-sm text-[#e06c75]"
        >
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-[#828997]">Category details</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#d7dae0]">
            {category.name}
          </h1>
        </div>
        <Link
          href="/admin/categories"
          className="text-sm font-medium text-[#d19a66] hover:underline"
        >
          Back to categories
        </Link>
      </div>

      <form
        onSubmit={handleSave}
        className="space-y-5 rounded-xl border border-[#3e4451] bg-[#21252b] p-6"
      >
        <div>
          <label
            htmlFor="category-name"
            className="mb-2 block text-sm font-medium text-[#abb2bf]"
          >
            Name
          </label>
          <input
            id="category-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={100}
            required
            className="w-full rounded-lg border border-[#3e4451] bg-[#282c34] px-3 py-2.5 text-sm text-[#abb2bf] outline-none focus:border-[#d19a66]"
          />
        </div>

        <div>
          <label
            htmlFor="category-description"
            className="mb-2 block text-sm font-medium text-[#abb2bf]"
          >
            Description
          </label>
          <textarea
            id="category-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            maxLength={5000}
            rows={5}
            className="w-full resize-y rounded-lg border border-[#3e4451] bg-[#282c34] px-3 py-2.5 text-sm text-[#abb2bf] outline-none focus:border-[#d19a66]"
          />
        </div>

        {error ? (
          <p role="alert" className="text-sm text-[#e06c75]">
            {error}
          </p>
        ) : null}
        {success ? (
          <p role="status" className="text-sm text-[#98c379]">
            {success}
          </p>
        ) : null}

        <div className="flex flex-wrap justify-between gap-3">
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting || isSaving}
            className="rounded-lg border border-[#e06c75]/40 px-4 py-2.5 text-sm font-medium text-[#e06c75] hover:bg-[#e06c75]/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete category"}
          </button>
          <button
            type="submit"
            disabled={isSaving || isDeleting}
            className="rounded-lg bg-[#d19a66] px-4 py-2.5 text-sm font-medium text-[#282c34] hover:bg-[#e5ad7b] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
