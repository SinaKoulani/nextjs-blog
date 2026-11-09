import type { CreateCategoryDto } from "@/api/generated/nestBlogApi.schemas";

type AdminCategoryMock = CreateCategoryDto & { id: number };

export const mockAdminCategories: AdminCategoryMock[] = [
  { id: 1, name: "Engineering" },
  { id: 2, name: "Product" },
  { id: 3, name: "Design" },
  { id: 4, name: "Culture" },
  { id: 5, name: "Artificial Intelligence" },
];
