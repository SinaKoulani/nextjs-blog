import { getTags } from "@/api/generated/tags/tags";
import type {
  CreateTagDto,
  UpdateTagDto,
} from "@/api/generated/nestBlogApi.schemas";
import { safeCall } from "@/api/err/safe-call";
import type { HttpResponseType } from "@/api/err/http-response";

const {
  tagsControllerFindAll,
  tagsControllerCreate,
  tagsControllerFindOne,
  tagsControllerUpdate,
  tagsControllerRemove,
} = getTags();

export function fetchTags(): Promise<HttpResponseType<unknown[]>> {
  return safeCall(async () => {
    const data: unknown = await tagsControllerFindAll();

    if (!Array.isArray(data)) {
      throw new Error("Unexpected response shape from GET /tags");
    }

    return data;
  });
}

export function fetchTag(id: number): Promise<HttpResponseType<unknown>> {
  return safeCall(async () => {
    const data: unknown = await tagsControllerFindOne(id);

    if (typeof data !== "object" || data === null || Array.isArray(data)) {
      throw new Error("Unexpected response shape from GET /tags/{id}");
    }

    return data;
  });
}

export function createTag(data: CreateTagDto): Promise<HttpResponseType<void>> {
  return safeCall(async () => {
    await tagsControllerCreate(data);
  });
}

export function updateTag(
  id: number,
  data: UpdateTagDto,
): Promise<HttpResponseType<void>> {
  return safeCall(async () => {
    await tagsControllerUpdate(id, data);
  });
}

export function deleteTag(id: number): Promise<HttpResponseType<void>> {
  return safeCall(async () => {
    await tagsControllerRemove(id);
  });
}
