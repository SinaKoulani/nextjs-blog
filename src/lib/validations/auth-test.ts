import { z } from "zod";

/**
 * Validation rules for the login form.
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email"),
  password: z
    .string()
    .min(1, "Password is required")
    .max(72, "Password is too long"),
});

/** Login form values, inferred from `loginSchema`. */
export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Validation rules for the signup form.
 *
 * `confirmPassword` exists only on the client and is never sent to the backend.
 * The `refine` step compares both passwords and reports a mismatch on `confirmPassword`.
 */
export const signupSchema = z
  .object({
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
      .min(1, "Email is required")
      .email("Enter a valid email")
      .max(254, "Email is too long"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(72, "Password is too long"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

/** Signup form values, inferred from `signupSchema`. */
export type SignupInput = z.infer<typeof signupSchema>;