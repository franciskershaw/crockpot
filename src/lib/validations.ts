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

// Favourites validation schemas
export const addToFavouritesSchema = z.object({
  recipeId: z.string().min(1, "Recipe ID is required"),
});

export const removeFromFavouritesSchema = z.object({
  recipeId: z.string().min(1, "Recipe ID is required"),
});

// Type exports for the schemas
export type AddToMenuInput = z.infer<typeof addToMenuSchema>;
export type RemoveFromMenuInput = z.infer<typeof removeFromMenuSchema>;
export type AddToFavouritesInput = z.infer<typeof addToFavouritesSchema>;
export type RemoveFromFavouritesInput = z.infer<
  typeof removeFromFavouritesSchema
>;

// Shopping list validation schemas
export const toggleObtainedSchema = z.object({
  itemId: z.string().min(1),
  unitId: z.string().optional().nullable(),
});

export const removeShoppingListItemSchema = z.object({
  itemId: z.string().min(1),
  unitId: z.string().optional().nullable(),
});

export type ToggleObtainedInput = z.infer<typeof toggleObtainedSchema>;
export type RemoveShoppingListItemInput = z.infer<
  typeof removeShoppingListItemSchema
>;

export const updateShoppingListItemQuantitySchema = z.object({
  itemId: z.string().min(1),
  unitId: z.string().optional().nullable(),
  quantity: z.number().min(0),
});

export type UpdateShoppingListItemQuantityInput = z.infer<
  typeof updateShoppingListItemQuantitySchema
>;
