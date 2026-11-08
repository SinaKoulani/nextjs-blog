import { getUsers } from "@/api/generated/users/users";
import { safeCall } from "@/api/err/safe-call";
import type { HttpResponseType } from "@/api/err/http-response";
import type { User } from "@/types/user.type";

const { usersControllerGetMyProfile } = getUsers();

export function fetchMyProfile(): Promise<HttpResponseType<User>> {
  return safeCall(async () => {
    const data: unknown = await usersControllerGetMyProfile();

    if (typeof data !== "object" || data === null || Array.isArray(data)) {
      throw new Error("Unexpected response shape from GET /users/me");
    }

    return data as User;
  });
}
