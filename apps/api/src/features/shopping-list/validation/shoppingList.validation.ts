import { z } from "zod";

// Base schema for shopping list item operations
const shoppingListItemBaseSchema = z.object({
  itemId: z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid item ID format"),
  unitId: z
    .string()
    .regex(/^[a-fA-F0-9]{24}$/, "Invalid unit ID format")
    .nullable()
    .optional(),
  isManual: z.boolean().optional(),
});

// Schema for toggling obtained status
export const toggleObtainedSchema = shoppingListItemBaseSchema;

// Schema for removing an item from shopping list
export const removeShoppingListItemSchema = shoppingListItemBaseSchema;

// Schema for updating shopping list item quantity
export const updateShoppingListItemQuantitySchema =
  shoppingListItemBaseSchema.extend({
    quantity: z.number().min(0, "Quantity cannot be negative"),
  });

// Schema for adding a manual item to shopping list
export const addManualShoppingListItemSchema =
  shoppingListItemBaseSchema.extend({
    quantity: z.number().min(0.01, "Quantity must be greater than 0"),
  });

// Type exports
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
