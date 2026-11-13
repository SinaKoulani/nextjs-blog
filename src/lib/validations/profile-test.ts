import { z } from "zod";

export const profileSchema = z.object({
  firstName: z
    .string()
    .trim()
    .max(100, "First name is too long"),
  lastName: z
    .string()
    .trim()
    .max(100, "Last name is too long"),
  email: z.string().trim(),
  displayName: z.string().trim().max(100, "Display name is too long"),
  bio: z.string().trim(),
  phone: z.string().trim(),
  website: z.string().trim(),
});

export type ProfileInput = z.infer<typeof profileSchema>;
