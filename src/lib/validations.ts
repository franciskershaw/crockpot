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
