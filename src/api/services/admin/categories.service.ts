import { getCategories } from "@/api/generated/categories/categories";
import type {
  CreateCategoryDto,
  UpdateCategoryDto,
} from "@/api/generated/nestBlogApi.schemas";
import { safeCall } from "@/api/err/safe-call";
import type { HttpResponseType } from "@/api/err/http-response";

const {
  categoriesControllerFindAll,
  categoriesControllerCreate,
  categoriesControllerUpdate,
  categoriesControllerRemove,
  categoriesControllerFindOne,
} = getCategories();

export function fetchCategories(): Promise<HttpResponseType<unknown[]>> {
  return safeCall(async () => {
    const data: unknown = await categoriesControllerFindAll();

    if (!Array.isArray(data)) {
      throw new Error("Unexpected response shape from GET /categories");
    }

    return data;
  });
}
export function fetchCategory(id: number): Promise<HttpResponseType<unknown>> {
  return safeCall(async () => {
    const data: unknown = await categoriesControllerFindOne(id);

    if (typeof data !== "object" || data === null || Array.isArray(data)) {
      throw new Error("Unexpected response shape from GET /categories/{id}");
    }

    return data;
  });
}

export function createCategory(
  data: CreateCategoryDto,
): Promise<HttpResponseType<void>> {
  return safeCall(async () => {
    await categoriesControllerCreate(data);
  });
}

export function updateCategory(
  id: number,
  data: UpdateCategoryDto,
): Promise<HttpResponseType<void>> {
  return safeCall(async () => {
    await categoriesControllerUpdate(id, data);
  });
}

export function deleteCategory(id: number): Promise<HttpResponseType<void>> {
  return safeCall(async () => {
    await categoriesControllerRemove(id);
  });
}
