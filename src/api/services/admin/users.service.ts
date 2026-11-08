import { getUsers } from "@/api/generated/users/users";
import type { UpdateUserDto } from "@/api/generated/nestBlogApi.schemas";
import { safeCall } from "@/api/err/safe-call";
import type { HttpResponseType } from "@/api/err/http-response";
import type { User } from "@/types/user.type";

const {
  usersControllerFindAll,
  usersControllerFindOne,
  usersControllerUpdate,
  usersControllerRemove,
} = getUsers();

export function fetchUsers(): Promise<HttpResponseType<User[]>> {
  return safeCall(async () => {
    const data: unknown = await usersControllerFindAll();

    if (!Array.isArray(data)) {
      throw new Error("Unexpected response shape from GET /users");
    }

    return data as User[];
  });
}

export function fetchUser(id: number): Promise<HttpResponseType<User>> {
  return safeCall(async () => {
    const data: unknown = await usersControllerFindOne(id);

    if (typeof data !== "object" || data === null || Array.isArray(data)) {
      throw new Error("Unexpected response shape from GET /users/{id}");
    }

    return data as User;
  });
}

export function updateUser(
  id: number,
  dto: UpdateUserDto,
): Promise<HttpResponseType<void>> {
  return safeCall(() => usersControllerUpdate(id, dto));
}

export function deleteUser(id: number): Promise<HttpResponseType<void>> {
  return safeCall(() => usersControllerRemove(id));
}
