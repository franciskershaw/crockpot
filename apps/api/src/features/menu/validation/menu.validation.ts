import { z } from "zod";

// Schema for adding a recipe to menu
export const addToMenuSchema = z.object({
  recipeId: z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid recipe ID format"),
  serves: z
    .number()
    .int("Serves must be a whole number")
    .min(1, "Serves must be at least 1")
    .max(50, "Serves cannot exceed 50"),
});

// Schema for removing a recipe from menu
export const removeFromMenuSchema = z.object({
  recipeId: z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid recipe ID format"),
});

// Schema for updating serves amount
export const updateServesSchema = z.object({
  recipeId: z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid recipe ID format"),
  serves: z
    .number()
    .int("Serves must be a whole number")
    .min(1, "Serves must be at least 1")
    .max(50, "Serves cannot exceed 50"),
});

export type AddToMenuInput = z.infer<typeof addToMenuSchema>;
export type RemoveFromMenuInput = z.infer<typeof removeFromMenuSchema>;
export type UpdateServesInput = z.infer<typeof updateServesSchema>;
