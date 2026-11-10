"use client";

import { useEffect, useState } from "react";
import {
  createTag,
  deleteTag,
  fetchTags,
  updateTag,
} from "@/api/services/admin/tags.service";

type Tag = {
  id: number;
  name: string;
};

function isTag(value: unknown): value is Tag {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    typeof (value as Tag).id === "number" &&
    typeof (value as Tag).name === "string"
  );
}

export default function AdminTagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState("");
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState("");

  const [editingTagId, setEditingTagId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");

  const [deletingTagId, setDeletingTagId] = useState<number | null>(null);

  useEffect(() => {
    async function loadTags() {
      const response = await fetchTags();

      if (!response.isOK) {
        setError(response.error.displayMessage);
        setIsLoading(false);
        return;
      }

      if (!response.data.every(isTag)) {
        setError("Unexpected response shape from GET /tags");
        setIsLoading(false);
        return;
      }

      setTags(response.data);
      setIsLoading(false);
    }

    loadTags();
  }, []);

  async function handleCreateTag() {
    const trimmedName = name.trim();

    setCreateError("");
    setCreateSuccess("");

    if (!trimmedName) {
      setCreateError("Tag name is required.");
      return;
    }

    if (trimmedName.length > 100) {
      setCreateError("Tag name is too long.");
      return;
    }

    setIsCreating(true);

    const response = await createTag({
      name: trimmedName,
    });

    setIsCreating(false);

    if (!response.isOK) {
      setCreateError(response.error.displayMessage);
      return;
    }

    setName("");
    setCreateSuccess("Tag created successfully.");

    const tagsResponse = await fetchTags();

    if (tagsResponse.isOK && tagsResponse.data.every(isTag)) {
      setTags(tagsResponse.data);
    }
  }

  function startEditing(tag: Tag) {
    setEditingTagId(tag.id);
    setEditName(tag.name);
    setUpdateError("");
    setCreateError("");
    setCreateSuccess("");
  }

  function cancelEditing() {
    setEditingTagId(null);
    setEditName("");
    setUpdateError("");
  }

  async function handleUpdateTag(id: number) {
    const trimmedName = editName.trim();

    setUpdateError("");

    if (!trimmedName) {
      setUpdateError("Tag name is required.");
      return;
    }

    if (trimmedName.length > 100) {
      setUpdateError("Tag name is too long.");
      return;
    }

    setIsUpdating(true);

    const response = await updateTag(id, {
      name: trimmedName,
    });

    setIsUpdating(false);

    if (!response.isOK) {
      setUpdateError(response.error.displayMessage);
      return;
    }

    setTags((currentTags) =>
      currentTags.map((tag) =>
        tag.id === id ? { ...tag, name: trimmedName } : tag,
      ),
    );

    cancelEditing();
  }

  async function handleDeleteTag(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this tag?",
    );

    if (!confirmed) {
      return;
    }

    setDeletingTagId(id);

    const response = await deleteTag(id);

    setDeletingTagId(null);

    if (!response.isOK) {
      setError(response.error.displayMessage);
      return;
    }

    setTags((currentTags) => currentTags.filter((tag) => tag.id !== id));

    if (editingTagId === id) {
      cancelEditing();
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[#d7dae0]">
          Tags
        </h1>

        <p className="mt-1 text-sm text-[#828997]">Manage your blog tags.</p>
      </div>

      <div className="rounded-2xl border border-[#3e4451] bg-[#21252b] p-6 shadow-lg shadow-black/20">
        <h2 className="text-sm font-semibold text-[#d7dae0]">New Tag</h2>

        <div className="mt-4 flex gap-3">
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={100}
            disabled={isCreating}
            placeholder="Tag name"
            className="min-w-0 flex-1 rounded-lg border border-[#3e4451] bg-[#282c34] px-3 py-2.5 text-sm text-[#abb2bf] outline-none transition-colors placeholder:text-[#5c6370] focus:border-[#d19a66] disabled:opacity-50"
          />

          <button
            type="button"
            onClick={handleCreateTag}
            disabled={isCreating}
            className="rounded-lg bg-[#d19a66] px-4 py-2.5 text-sm font-semibold text-[#282c34] transition-colors hover:bg-[#e5ad7b] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isCreating ? "Creating..." : "Create Tag"}
          </button>
        </div>

        {(createError || createSuccess) && (
          <p
            className={`mt-3 text-xs ${
              createError ? "text-[#d19a66]" : "text-[#98c379]"
            }`}
          >
            {createError || createSuccess}
          </p>
        )}
      </div>

      {isLoading && (
        <div className="rounded-2xl border border-[#3e4451] bg-[#21252b] p-8 text-center text-sm text-[#828997]">
          Loading tags...
        </div>
      )}

      {!isLoading && error && (
        <div className="rounded-2xl border border-[#3e4451] bg-[#21252b] p-8 text-center">
          <p className="text-sm text-[#d19a66]">{error}</p>
        </div>
      )}

      {!isLoading && !error && tags.length === 0 && (
        <div className="rounded-2xl border border-[#3e4451] bg-[#21252b] p-8 text-center">
          <p className="text-sm text-[#828997]">No tags found.</p>
        </div>
      )}

      {!isLoading && !error && tags.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-[#3e4451] bg-[#21252b] shadow-lg shadow-black/20">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[#3e4451] bg-white/[0.03]">
                <tr>
                  <th className="px-4 py-3 font-medium text-[#828997]">Name</th>

                  <th className="px-4 py-3 font-medium text-[#828997]">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#3e4451]">
                {tags.map((tag) => {
                  const isEditing = editingTagId === tag.id;
                  const isDeleting = deletingTagId === tag.id;

                  return (
                    <tr
                      key={tag.id}
                      className="transition-colors hover:bg-[#282c34]"
                    >
                      <td className="px-4 py-4">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editName}
                            onChange={(event) =>
                              setEditName(event.target.value)
                            }
                            maxLength={100}
                            disabled={isUpdating}
                            autoFocus
                            className="w-full max-w-sm rounded-lg border border-[#3e4451] bg-[#282c34] px-3 py-2 text-sm text-[#abb2bf] outline-none focus:border-[#d19a66] disabled:opacity-50"
                          />
                        ) : (
                          <span className="font-medium text-[#abb2bf]">
                            {tag.name}
                          </span>
                        )}

                        {isEditing && updateError && (
                          <p className="mt-2 text-xs text-[#d19a66]">
                            {updateError}
                          </p>
                        )}
                      </td>

                      <td className="px-4 py-4">
                        {isEditing ? (
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => handleUpdateTag(tag.id)}
                              disabled={isUpdating}
                              className="text-xs font-medium text-[#98c379] hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {isUpdating ? "Saving..." : "Save"}
                            </button>

                            <button
                              type="button"
                              onClick={cancelEditing}
                              disabled={isUpdating}
                              className="text-xs font-medium text-[#828997] hover:text-[#abb2bf] disabled:opacity-50"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => startEditing(tag)}
                              disabled={isDeleting}
                              className="text-xs font-medium text-[#d19a66] hover:text-[#e5ad7b] hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteTag(tag.id)}
                              disabled={isDeleting}
                              className="text-xs font-medium text-[#828997] hover:text-[#abb2bf] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {isDeleting ? "Deleting..." : "Delete"}
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
