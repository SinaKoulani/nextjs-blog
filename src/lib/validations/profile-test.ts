import { z } from "zod";

export const profileSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(100, "First name is too long"),
  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(100, "Last name is too long"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email")
    .max(254, "Email is too long"),
  displayName: z.string().trim().max(100, "Display name is too long"),
  bio: z.string().trim(),
  phone: z.string().trim(),
  website: z
    .string()
    .trim()
    .refine((v) => v === "" || /^https?:\/\/\S+$/.test(v), {
      message: "Website must start with http:// or https://",
    }),
});

export type ProfileInput = z.infer<typeof profileSchema>;
