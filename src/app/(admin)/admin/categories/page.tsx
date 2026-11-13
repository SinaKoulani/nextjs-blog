"use client";

import { useEffect, useState } from "react";
import {
  createCategory,
  deleteCategory,
  fetchCategories,
  updateCategory,
} from "@/api/services/admin/categories.service";

type Category = {
  id: number;
  name: string;
  description?: unknown;
};

function isCategory(value: unknown): value is Category {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const category = value as Partial<Category>;

  return typeof category.id === "number" && typeof category.name === "string";
}

function parseDescription(
  value: string,
):
  | { isValid: true; description: Record<string, unknown> | null }
  | { isValid: false } {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return { isValid: true, description: null };
  }

  try {
    const description: unknown = JSON.parse(trimmedValue);

    if (
      typeof description !== "object" ||
      description === null ||
      Array.isArray(description)
    ) {
      return { isValid: false };
    }

    return {
      isValid: true,
      description: description as Record<string, unknown>,
    };
  } catch {
    return { isValid: false };
  }
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [editError, setEditError] = useState("");

  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    async function loadCategories() {
      const response = await fetchCategories();

      if (!response.isOK) {
        setError(response.error.displayMessage);
        setIsLoading(false);
        return;
      }

      if (!response.data.every(isCategory)) {
        setError("Unexpected response shape from GET /categories");
        setIsLoading(false);
        return;
      }

      setCategories(response.data);
      setIsLoading(false);
    }

    loadCategories();
  }, []);

  async function handleCreateCategory() {
    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    setCreateError("");
    setCreateSuccess("");

    if (!trimmedName) {
      setCreateError("Category name is required.");
      return;
    }

    if (trimmedName.length > 100) {
      setCreateError("Category name is too long.");
      return;
    }

    if (trimmedDescription.length > 5000) {
      setCreateError("Description is too long.");
      return;
    }

    const parsedDescription = parseDescription(trimmedDescription);

    if (!parsedDescription.isValid) {
      setCreateError("Description must be a valid JSON object.");
      return;
    }

    setIsCreating(true);

    const response = await createCategory({
      name: trimmedName,
      description: parsedDescription.description,
    });

    setIsCreating(false);

    if (!response.isOK) {
      setCreateError(response.error.displayMessage);
      return;
    }

    setName("");
    setDescription("");
    setCreateSuccess("Category created successfully.");

    const categoriesResponse = await fetchCategories();

    if (!categoriesResponse.isOK) {
      setError(categoriesResponse.error.displayMessage);
      return;
    }

    if (!categoriesResponse.data.every(isCategory)) {
      setError("Unexpected response shape from GET /categories");
      return;
    }

    setCategories(categoriesResponse.data);
    setError("");
  }

  function startEditing(category: Category) {
    setEditingId(category.id);
    setEditName(category.name);
    setEditDescription(
      category.description === null || category.description === undefined
        ? ""
        : JSON.stringify(category.description) ?? "",
    );
    setEditError("");
  }

  function cancelEditing() {
    setEditingId(null);
    setEditName("");
    setEditDescription("");
    setEditError("");
  }

  async function handleUpdateCategory(id: number) {
    const trimmedName = editName.trim();
    const trimmedDescription = editDescription.trim();

    setEditError("");

    if (!trimmedName) {
      setEditError("Category name is required.");
      return;
    }

    if (trimmedName.length > 100) {
      setEditError("Category name is too long.");
      return;
    }

    if (trimmedDescription.length > 5000) {
      setEditError("Description is too long.");
      return;
    }

    const parsedDescription = parseDescription(trimmedDescription);

    if (!parsedDescription.isValid) {
      setEditError("Description must be a valid JSON object.");
      return;
    }

    setIsUpdating(true);

    const response = await updateCategory(id, {
      name: trimmedName,
      description: parsedDescription.description,
    });

    setIsUpdating(false);

    if (!response.isOK) {
      setEditError(response.error.displayMessage);
      return;
    }

    setCategories((current) =>
      current.map((category) =>
        category.id === id
          ? {
              ...category,
              name: trimmedName,
              description: parsedDescription.description,
            }
          : category,
      ),
    );

    cancelEditing();
  }

  async function handleDeleteCategory(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?",
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(id);

    const response = await deleteCategory(id);

    setDeletingId(null);

    if (!response.isOK) {
      setError(response.error.displayMessage);
      return;
    }

    setCategories((current) =>
      current.filter((category) => category.id !== id),
    );

    if (editingId === id) {
      cancelEditing();
    }
  }

  function getDescription(category: Category) {
    if (category.description === null || category.description === undefined) {
      return "—";
    }

    return typeof category.description === "string"
      ? category.description
      : JSON.stringify(category.description) ?? "—";
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[#d7dae0]">
          Categories
        </h1>
        <p className="mt-1 text-sm text-[#828997]">
          Manage your blog categories.
        </p>
      </div>

      <section className="rounded-xl border border-[#3e4451] bg-[#21252b] p-6">
        <div className="mb-5">
          <h2 className="text-base font-semibold text-[#d7dae0]">
            Create category
          </h2>
          <p className="mt-1 text-sm text-[#828997]">
            Add a new category to your blog.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="category-name"
              className="mb-2 block text-xs font-medium text-[#828997]"
            >
              Name
            </label>

            <input
              id="category-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Category name"
              className="w-full rounded-lg border border-[#3e4451] bg-[#282c34] px-3 py-2.5 text-sm text-[#abb2bf] outline-none placeholder:text-[#5c6370] focus:border-[#d19a66]"
            />
          </div>

          <div>
            <label
              htmlFor="category-description"
              className="mb-2 block text-xs font-medium text-[#828997]"
            >
              Description
            </label>

            <input
              id="category-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="JSON object"
              className="w-full rounded-lg border border-[#3e4451] bg-[#282c34] px-3 py-2.5 text-sm text-[#abb2bf] outline-none placeholder:text-[#5c6370] focus:border-[#d19a66]"
            />
            <p className="mt-1.5 text-xs text-[#5c6370]">
              Enter a JSON object; leave blank to send null.
            </p>
          </div>
        </div>

        {createError ? (
          <p className="mt-4 text-sm text-[#e06c75]">{createError}</p>
        ) : null}

        {createSuccess ? (
          <p className="mt-4 text-sm text-[#98c379]">{createSuccess}</p>
        ) : null}

        <button
          type="button"
          onClick={handleCreateCategory}
          disabled={isCreating}
          className="mt-5 rounded-lg bg-[#d19a66] px-4 py-2.5 text-sm font-medium text-[#282c34] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isCreating ? "Creating..." : "Create category"}
        </button>
      </section>

      <section className="rounded-xl border border-[#3e4451] bg-[#21252b]">
        <div className="border-b border-[#3e4451] px-6 py-5">
          <h2 className="text-base font-semibold text-[#d7dae0]">Categories</h2>
        </div>

        {isLoading ? (
          <div className="px-6 py-10 text-sm text-[#828997]">
            Loading categories...
          </div>
        ) : error ? (
          <div className="px-6 py-10">
            <p className="text-sm text-[#e06c75]">{error}</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="px-6 py-10 text-sm text-[#828997]">
            No categories found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead>
                <tr className="border-b border-[#3e4451] text-xs text-[#828997]">
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Description</th>
                  <th className="px-6 py-4 text-right font-medium">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#3e4451]">
                {categories.map((category) => {
                  const isEditing = editingId === category.id;

                  return (
                    <tr key={category.id}>
                      {isEditing ? (
                        <>
                          <td className="px-6 py-4 align-top">
                            <input
                              value={editName}
                              onChange={(event) =>
                                setEditName(event.target.value)
                              }
                              className="w-full rounded-lg border border-[#3e4451] bg-[#282c34] px-3 py-2 text-sm text-[#abb2bf] outline-none focus:border-[#d19a66]"
                            />
                          </td>

                          <td className="px-6 py-4 align-top">
                            <input
                              value={editDescription}
                              onChange={(event) =>
                                setEditDescription(event.target.value)
                              }
                              placeholder="JSON object"
                              className="w-full rounded-lg border border-[#3e4451] bg-[#282c34] px-3 py-2 text-sm text-[#abb2bf] outline-none focus:border-[#d19a66]"
                            />

                            {editError ? (
                              <p className="mt-2 text-xs text-[#e06c75]">
                                {editError}
                              </p>
                            ) : null}
                          </td>

                          <td className="px-6 py-4 align-top">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  handleUpdateCategory(category.id)
                                }
                                disabled={isUpdating}
                                className="rounded-lg bg-[#98c379] px-3 py-2 text-xs font-medium text-[#282c34] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {isUpdating ? "Saving..." : "Save"}
                              </button>

                              <button
                                type="button"
                                onClick={cancelEditing}
                                disabled={isUpdating}
                                className="rounded-lg border border-[#3e4451] px-3 py-2 text-xs font-medium text-[#abb2bf] hover:bg-[#282c34] disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                Cancel
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-6 py-4 text-sm font-medium text-[#d7dae0]">
                            {category.name}
                          </td>

                          <td className="px-6 py-4 text-sm text-[#828997]">
                            {getDescription(category)}
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => startEditing(category)}
                                className="rounded-lg border border-[#3e4451] px-3 py-2 text-xs font-medium text-[#abb2bf] hover:bg-[#282c34] hover:text-[#d19a66]"
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteCategory(category.id)
                                }
                                disabled={deletingId === category.id}
                                className="rounded-lg border border-[#e06c75]/40 px-3 py-2 text-xs font-medium text-[#e06c75] hover:bg-[#e06c75]/10 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {deletingId === category.id
                                  ? "Deleting..."
                                  : "Delete"}
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
