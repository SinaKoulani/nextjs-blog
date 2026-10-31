
import { z } from "zod";

/**
 * it defines validation rules for the login form
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter valid email"),
  password: z
    .string()
    .min(1, "Password is required")
    .max(72, "Password is too long"),
});
// Auto export with infer
export type LoginInput = z.infer<typeof loginSchema>;



/**
 * defines validation rules for the signup form
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

    confirmPassword: z
      .string()
      .min(1, "Please confirm your password"),
  })

/**
 * it gets all the data and see if 
 * the password does match the confirm password or not
 */

  .refine(
    (data) => data.password === data.confirmPassword,
    /**
     * it throw error when password doesnt match 
     * and "path" matches error to confirmPAssword
     */
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

  //auto export again 
export type SignupInput = z.infer<typeof signupSchema>;
