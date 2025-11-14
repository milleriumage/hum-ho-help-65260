import { z } from 'zod';

// Message validation
export const messageSchema = z.object({
  content: z.string()
    .trim()
    .min(1, "Message cannot be empty")
    .max(1000, "Message too long (max 1000 characters)")
    .refine(val => !/<script|javascript:/i.test(val), "Invalid content detected"),
  recipientId: z.string().uuid("Invalid recipient ID"),
});

// Content creation validation
export const contentSchema = z.object({
  title: z.string()
    .trim()
    .min(1, "Title cannot be empty")
    .max(100, "Title too long (max 100 characters)")
    .refine(val => !/<script|javascript:/i.test(val), "Invalid content detected"),
  description: z.string()
    .trim()
    .min(1, "Description cannot be empty")
    .max(500, "Description too long (max 500 characters)")
    .refine(val => !/<script|javascript:/i.test(val), "Invalid content detected"),
  price: z.number()
    .min(0, "Price must be positive")
    .max(10000, "Price too high"),
  isLocked: z.boolean(),
});

// Gemini prompt validation
export const geminiPromptSchema = z.object({
  query: z.string()
    .trim()
    .min(1, "Query cannot be empty")
    .max(500, "Query too long (max 500 characters)")
    .refine(val => !/<script|javascript:/i.test(val), "Invalid content detected"),
});

// Profile update validation
export const profileUpdateSchema = z.object({
  username: z.string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username too long (max 30 characters)")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, _ and -"),
  bio: z.string()
    .trim()
    .max(500, "Bio too long (max 500 characters)")
    .optional(),
});

// Credit purchase validation
export const creditPurchaseSchema = z.object({
  packageId: z.string().uuid("Invalid package ID"),
  amount: z.number()
    .min(1, "Amount must be at least 1")
    .max(1000000, "Amount too high"),
});

// Sanitize HTML to prevent XSS
export function sanitizeHtml(html: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    "/": '&#x2F;',
  };
  return html.replace(/[&<>"'/]/g, (char) => map[char]);
}

// Validate and sanitize user input
export function validateAndSanitize<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      return { success: false, error: firstError?.message || "Validation failed" };
    }
    return { success: false, error: "Validation failed" };
  }
}
