import { z } from "zod";

// Menu validation schemas
export const addToMenuSchema = z.object({
  recipeId: z.string().min(1, "Recipe ID is required"),
  serves: z
    .number()
    .min(1, "Serves must be at least 1")
    .max(20, "Serves cannot exceed 20"),
});

export const removeFromMenuSchema = z.object({
  recipeId: z.string().min(1, "Recipe ID is required"),
});

// Type exports for the schemas
export type AddToMenuInput = z.infer<typeof addToMenuSchema>;
export type RemoveFromMenuInput = z.infer<typeof removeFromMenuSchema>;
