import type { CreateTagDto } from "@/api/generated/nestBlogApi.schemas";

type AdminTagMock = CreateTagDto & { id: number };

export const mockAdminTags: AdminTagMock[] = [
  { id: 1, name: "Design systems" },
  { id: 2, name: "UX" },
  { id: 3, name: "Product strategy" },
  { id: 4, name: "Research" },
  { id: 5, name: "TypeScript" },
  { id: 6, name: "Software engineering" },
  { id: 7, name: "Accessibility" },
  { id: 8, name: "Remote work" },
  { id: 9, name: "Team culture" },
  { id: 10, name: "Code review" },
  { id: 11, name: "Components" },
  { id: 12, name: "AI" },
  { id: 13, name: "APIs" },
];
