import { getCategories } from "@/api/generated/categories/categories";
import { getTags } from "@/api/generated/tags/tags";
import { safeCall } from "@/api/err/safe-call";
import type { HttpResponseType } from "@/api/err/http-response";
import type { Category, Tag } from "@/types/taxonomy.type";

const { categoriesControllerFindAll } = getCategories();
const { tagsControllerFindAll } = getTags();

export function fetchPublicCategories(): Promise<HttpResponseType<Category[]>> {
  return safeCall(async () => {
    const data: unknown = await categoriesControllerFindAll();

    if (!Array.isArray(data)) {
      throw new Error("Unexpected response shape from GET /categories");
    }

    return data as Category[];
  });
}

export function fetchPublicTags(): Promise<HttpResponseType<Tag[]>> {
  return safeCall(async () => {
    const data: unknown = await tagsControllerFindAll();

    if (!Array.isArray(data)) {
      throw new Error("Unexpected response shape from GET /tags");
    }

    return data as Tag[];
  });
}
