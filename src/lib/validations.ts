import { z } from "zod";
import { objectIdSchema, optionalObjectIdSchema } from "@/lib/security";

// ===================================
// SHARED VALIDATION SCHEMAS
// ===================================

/**
 * Common field validators
 */
export const recipeIdField = objectIdSchema;
export const itemIdField = objectIdSchema;
export const unitIdField = optionalObjectIdSchema;
export const userIdField = objectIdSchema;

/**
 * Common object schemas
 */
export const servesField = z
  .number()
  .min(1, "Serves must be at least 1")
  .max(20, "Serves cannot exceed 20");

export const quantityField = z.number().min(0, "Quantity cannot be negative");

export const positiveQuantityField = z
  .number()
  .min(0.01, "Quantity must be greater than 0");

export const isManualField = z.boolean().optional();

/**
 * Shopping list item base schema - reused across multiple operations
 */
export const shoppingListItemBaseSchema = z.object({
  itemId: itemIdField,
  unitId: unitIdField,
  isManual: isManualField,
});

/**
 * Recipe operation base schema - reused for favorites and menu operations
 */
export const recipeOperationBaseSchema = z.object({
  recipeId: recipeIdField,
});

// ===================================
// SPECIFIC OPERATION SCHEMAS
// ===================================

/**
 * Menu operations
 */
export const addToMenuSchema = recipeOperationBaseSchema.extend({
  serves: servesField,
});

export const removeFromMenuSchema = recipeOperationBaseSchema;

/**
 * Favourites operations
 */
export const addToFavouritesSchema = recipeOperationBaseSchema;
export const removeFromFavouritesSchema = recipeOperationBaseSchema;

/**
 * Shopping list operations
 */
export const toggleObtainedSchema = shoppingListItemBaseSchema;

export const removeShoppingListItemSchema = shoppingListItemBaseSchema;

export const updateShoppingListItemQuantitySchema =
  shoppingListItemBaseSchema.extend({
    quantity: quantityField,
  });

export const addManualShoppingListItemSchema =
  shoppingListItemBaseSchema.extend({
    quantity: positiveQuantityField,
  });

/**
 * Recipe creation operations
 */
const createRecipeIngredientSchema = z.object({
  itemId: itemIdField,
  unitId: unitIdField,
  quantity: positiveQuantityField,
});

const recipeImageSchema = z
  .object({
    url: z.string().url("Invalid image URL"),
    filename: z.string().min(1, "Image filename is required"),
  })
  .optional();

export const createRecipeSchema = z.object({
  name: z
    .string()
    .min(3, "Recipe name must be at least 3 characters")
    .max(100, "Recipe name must be less than 100 characters"),
  timeInMinutes: z
    .number()
    .int("Time must be a whole number")
    .min(1, "Time must be at least 1 minute")
    .max(1440, "Time cannot exceed 24 hours"),
  instructions: z
    .array(z.string().min(1, "Instructions cannot be empty"))
    .min(1, "At least one instruction is required")
    .max(50, "Cannot have more than 50 instructions"),
  notes: z.array(z.string()).max(10, "Cannot have more than 10 notes"),
  serves: z
    .number()
    .int("Serves must be a whole number")
    .min(1, "Must serve at least 1 person")
    .max(50, "Cannot serve more than 50 people"),
  categoryIds: z
    .array(objectIdSchema)
    .min(1, "At least one category is required")
    .max(3, "Cannot have more than 3 categories"),
  ingredients: z
    .array(createRecipeIngredientSchema)
    .min(1, "At least one ingredient is required")
    .max(50, "Cannot have more than 50 ingredients"),
  image: recipeImageSchema,
});

export const updateRecipeSchema = createRecipeSchema.partial();

// ===================================
// TYPE EXPORTS
// ===================================

export type AddToMenuInput = z.infer<typeof addToMenuSchema>;
export type RemoveFromMenuInput = z.infer<typeof removeFromMenuSchema>;
export type AddToFavouritesInput = z.infer<typeof addToFavouritesSchema>;
export type RemoveFromFavouritesInput = z.infer<
  typeof removeFromFavouritesSchema
>;
export type ToggleObtainedInput = z.infer<typeof toggleObtainedSchema>;
export type RemoveShoppingListItemInput = z.infer<
  typeof removeShoppingListItemSchema
>;
export type UpdateShoppingListItemQuantityInput = z.infer<
  typeof updateShoppingListItemQuantitySchema
>;
export type AddManualShoppingListItemInput = z.infer<
  typeof addManualShoppingListItemSchema
>;
export type CreateRecipeInput = z.infer<typeof createRecipeSchema>;
export type UpdateRecipeInput = z.infer<typeof updateRecipeSchema>;
