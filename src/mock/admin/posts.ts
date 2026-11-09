import type { CreatePostDto } from "@/api/generated/nestBlogApi.schemas";
import type { Post } from "@/types/post.type";

type AdminPostMock = Post &
  Required<Pick<CreatePostDto, "isPublished" | "categoryIds" | "tagIds">>;

export const mockAdminPosts: AdminPostMock[] = [
  {
    id: 1,
    title: "Building a Reliable Design System",
    slug: "building-a-reliable-design-system",
    excerpt:
      "Practical principles for creating reusable UI foundations that scale with a product.",
    createdAt: "2026-10-28T09:00:00.000Z",
    updatedAt: "2026-11-02T14:30:00.000Z",
    isPublished: true,
    categoryIds: [1, 2],
    tagIds: [1, 2],
  },
  {
    id: 2,
    title: "A Field Guide to Product Discovery",
    slug: "field-guide-to-product-discovery",
    excerpt:
      "How small research habits help teams make more confident product decisions.",
    createdAt: "2026-10-25T10:15:00.000Z",
    updatedAt: "2026-10-30T16:00:00.000Z",
    isPublished: true,
    categoryIds: [2],
    tagIds: [3, 4],
  },
  {
    id: 3,
    title: "TypeScript Patterns for Growing Teams",
    slug: "typescript-patterns-growing-teams",
    excerpt:
      "A look at practical patterns that keep TypeScript code understandable as teams grow.",
    createdAt: "2026-10-20T08:45:00.000Z",
    updatedAt: "2026-10-27T11:20:00.000Z",
    isPublished: true,
    categoryIds: [1],
    tagIds: [5, 6],
  },
  {
    id: 4,
    title: "Designing Better Empty States",
    slug: "designing-better-empty-states",
    excerpt:
      "Turn a blank screen into a helpful moment with clear guidance and useful next steps.",
    createdAt: "2026-10-16T13:10:00.000Z",
    updatedAt: "2026-10-22T09:15:00.000Z",
    isPublished: true,
    categoryIds: [2, 3],
    tagIds: [1, 7],
  },
  {
    id: 5,
    title: "Making Remote Collaboration Work",
    slug: "making-remote-collaboration-work",
    excerpt:
      "Simple team agreements that make distributed work more focused and inclusive.",
    createdAt: "2026-10-12T12:00:00.000Z",
    updatedAt: "2026-10-19T15:40:00.000Z",
    isPublished: true,
    categoryIds: [4],
    tagIds: [8, 9],
  },
  {
    id: 6,
    title: "The Case for Smaller Pull Requests",
    slug: "case-for-smaller-pull-requests",
    excerpt:
      "Why keeping changes focused can improve review quality and delivery speed.",
    createdAt: "2026-10-08T07:30:00.000Z",
    updatedAt: "2026-10-14T10:00:00.000Z",
    isPublished: true,
    categoryIds: [1, 4],
    tagIds: [5, 10],
  },
  {
    id: 7,
    title: "Content Design for Developer Tools",
    slug: "content-design-developer-tools",
    excerpt:
      "Use clear language and consistent terminology to make technical products easier to use.",
    createdAt: "2026-10-03T11:25:00.000Z",
    updatedAt: "2026-10-10T08:50:00.000Z",
    isPublished: true,
    categoryIds: [3, 1],
    tagIds: [2, 6],
  },
  {
    id: 8,
    title: "Planning an Accessible Component Library",
    slug: "planning-accessible-component-library",
    excerpt:
      "A draft checklist for accessibility decisions in a shared component library.",
    createdAt: "2026-11-01T10:00:00.000Z",
    updatedAt: "2026-11-05T13:20:00.000Z",
    isPublished: false,
    categoryIds: [3, 1],
    tagIds: [1, 7, 11],
  },
  {
    id: 9,
    title: "Notes on Evaluating AI Features",
    slug: "notes-evaluating-ai-features",
    excerpt:
      "An outline for testing AI-powered experiences against real user needs.",
    createdAt: "2026-10-29T14:05:00.000Z",
    updatedAt: "2026-11-04T09:35:00.000Z",
    isPublished: false,
    categoryIds: [5, 2],
    tagIds: [4, 12],
  },
  {
    id: 10,
    title: "A Practical Guide to API Documentation",
    slug: "practical-guide-api-documentation",
    excerpt:
      "A draft about making API references easier to navigate and maintain.",
    createdAt: "2026-10-24T08:00:00.000Z",
    updatedAt: "2026-10-31T12:45:00.000Z",
    isPublished: false,
    categoryIds: [1],
    tagIds: [5, 13],
  },
  {
    id: 11,
    title: "Working with Feedback Without Losing Focus",
    slug: "working-with-feedback-without-losing-focus",
    excerpt:
      "A draft exploring ways to gather useful feedback while protecting time for deep work.",
    createdAt: "2026-10-18T16:15:00.000Z",
    updatedAt: "2026-10-26T10:10:00.000Z",
    isPublished: false,
    categoryIds: [4, 2],
    tagIds: [3, 9],
  },
  {
    id: 12,
    title: "From Prototype to Production",
    slug: "from-prototype-to-production",
    excerpt:
      "A draft about the decisions that help a promising prototype become a maintainable product.",
    createdAt: "2026-10-11T09:20:00.000Z",
    updatedAt: "2026-10-21T14:55:00.000Z",
    isPublished: false,
    categoryIds: [2, 1],
    tagIds: [3, 5, 10],
  },
];
