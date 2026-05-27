import { z } from "zod";

export const loginBodySchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerBodySchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    // Client omits this when calling the API (it validates confirm locally in the form).
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => !data.confirmPassword || data.password === data.confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    },
  );

// validateSchema expects a schema for { body, query, params }
export const loginRequestSchema = z.object({
  body: loginBodySchema,
  query: z.any().optional(),
  params: z.any().optional(),
});

export const registerRequestSchema = z.object({
  body: registerBodySchema,
  query: z.any().optional(),
  params: z.any().optional(),
});

