import { z } from "zod";

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// Validates the fields accepted by the create-post form.
export const createPostSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title is too long"),
  slug: z
    .string()
    .trim()
    .max(250, "Slug is too long")
    .regex(SLUG_PATTERN, "Use lowercase letters, numbers and dashes only")
    .optional(),
  excerpt: z.string().trim().max(500, "Excerpt is too long").optional(),
  isPublished: z.boolean(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
