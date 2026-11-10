"use client";

import { useEffect, useState } from "react";
import {
  deleteUser,
  fetchUsers,
  updateUser,
} from "@/api/services/admin/users.service";
import type { User } from "@/types/user.type";

function isUser(value: unknown): value is User {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    typeof (value as User).id === "number" &&
    typeof (value as User).email === "string"
  );
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");

  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);

  useEffect(() => {
    async function loadUsers() {
      const response = await fetchUsers();

      if (!response.isOK) {
        setError(response.error.displayMessage);
        setIsLoading(false);
        return;
      }

      if (!response.data.every(isUser)) {
        setError("Unexpected response shape from GET /users");
        setIsLoading(false);
        return;
      }

      setUsers(response.data);
      setIsLoading(false);
    }

    loadUsers();
  }, []);

  function startEditing(user: User) {
    setEditingUserId(user.id);
    setEditFirstName(user.firstName ?? "");
    setEditLastName(user.lastName ?? "");
    setEditEmail(user.email);
    setUpdateError("");
  }

  function cancelEditing() {
    setEditingUserId(null);
    setEditFirstName("");
    setEditLastName("");
    setEditEmail("");
    setUpdateError("");
  }

  async function handleUpdateUser(id: number) {
    const firstName = editFirstName.trim();
    const lastName = editLastName.trim();
    const email = editEmail.trim();

    setUpdateError("");

    if (!firstName) {
      setUpdateError("First name is required.");
      return;
    }

    if (!lastName) {
      setUpdateError("Last name is required.");
      return;
    }

    if (!email) {
      setUpdateError("Email is required.");
      return;
    }

    setIsUpdating(true);

    const response = await updateUser(id, {
      firstName,
      lastName,
      email,
    });

    setIsUpdating(false);

    if (!response.isOK) {
      setUpdateError(response.error.displayMessage);
      return;
    }

    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === id
          ? {
              ...user,
              firstName,
              lastName,
              email,
            }
          : user,
      ),
    );

    cancelEditing();
  }

  async function handleDeleteUser(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?",
    );

    if (!confirmed) {
      return;
    }

    setDeletingUserId(id);

    const response = await deleteUser(id);

    setDeletingUserId(null);

    if (!response.isOK) {
      setError(response.error.displayMessage);
      return;
    }

    setUsers((currentUsers) => currentUsers.filter((user) => user.id !== id));

    if (editingUserId === id) {
      cancelEditing();
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[#d7dae0]">
          Users
        </h1>

        <p className="mt-1 text-sm text-[#828997]">Manage your users.</p>
      </div>

      {isLoading && (
        <div className="rounded-2xl border border-[#3e4451] bg-[#21252b] p-8 text-center text-sm text-[#828997]">
          Loading users...
        </div>
      )}

      {!isLoading && error && (
        <div className="rounded-2xl border border-[#3e4451] bg-[#21252b] p-8 text-center">
          <p className="text-sm text-[#d19a66]">{error}</p>
        </div>
      )}

      {!isLoading && !error && users.length === 0 && (
        <div className="rounded-2xl border border-[#3e4451] bg-[#21252b] p-8 text-center">
          <p className="text-sm text-[#828997]">No users found.</p>
        </div>
      )}

      {!isLoading && !error && users.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-[#3e4451] bg-[#21252b] shadow-lg shadow-black/20">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[#3e4451] bg-white/[0.03]">
                <tr>
                  <th className="px-4 py-3 font-medium text-[#828997]">Name</th>

                  <th className="px-4 py-3 font-medium text-[#828997]">
                    Email
                  </th>

                  <th className="px-4 py-3 font-medium text-[#828997]">Bio</th>

                  <th className="px-4 py-3 font-medium text-[#828997]">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#3e4451]">
                {users.map((user) => {
                  const isEditing = editingUserId === user.id;
                  const isDeleting = deletingUserId === user.id;

                  return (
                    <tr
                      key={user.id}
                      className="transition-colors hover:bg-[#282c34]"
                    >
                      <td className="px-4 py-4">
                        {isEditing ? (
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={editFirstName}
                              onChange={(event) =>
                                setEditFirstName(event.target.value)
                              }
                              disabled={isUpdating}
                              placeholder="First name"
                              className="w-full max-w-xs rounded-lg border border-[#3e4451] bg-[#282c34] px-3 py-2 text-sm text-[#abb2bf] outline-none focus:border-[#d19a66] disabled:opacity-50"
                            />

                            <input
                              type="text"
                              value={editLastName}
                              onChange={(event) =>
                                setEditLastName(event.target.value)
                              }
                              disabled={isUpdating}
                              placeholder="Last name"
                              className="w-full max-w-xs rounded-lg border border-[#3e4451] bg-[#282c34] px-3 py-2 text-sm text-[#abb2bf] outline-none focus:border-[#d19a66] disabled:opacity-50"
                            />
                          </div>
                        ) : (
                          <span className="font-medium text-[#abb2bf]">
                            {user.displayName ||
                              `${user.firstName} ${user.lastName}`}
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-4">
                        {isEditing ? (
                          <input
                            type="email"
                            value={editEmail}
                            onChange={(event) =>
                              setEditEmail(event.target.value)
                            }
                            disabled={isUpdating}
                            placeholder="Email"
                            className="w-full min-w-64 rounded-lg border border-[#3e4451] bg-[#282c34] px-3 py-2 text-sm text-[#abb2bf] outline-none focus:border-[#d19a66] disabled:opacity-50"
                          />
                        ) : (
                          <span className="text-[#abb2bf]">{user.email}</span>
                        )}
                      </td>

                      <td className="px-4 py-4 text-[#828997]">
                        {user.bio || "—"}
                      </td>

                      <td className="px-4 py-4">
                        {isEditing ? (
                          <div>
                            {updateError && (
                              <p className="mb-2 text-xs text-[#d19a66]">
                                {updateError}
                              </p>
                            )}

                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => handleUpdateUser(user.id)}
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
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => startEditing(user)}
                              disabled={isDeleting}
                              className="text-xs font-medium text-[#d19a66] hover:text-[#e5ad7b] hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteUser(user.id)}
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
