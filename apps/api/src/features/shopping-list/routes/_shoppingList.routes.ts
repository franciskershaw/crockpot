import { Hono } from "hono";

import { authenticate } from "../../../core/middleware/auth.middleware";
import { validate } from "../../../core/utils/validate";
import shoppingListControllers from "../controllers/_shoppingList.controller";
import {
  addManualShoppingListItemSchema,
  removeShoppingListItemSchema,
  toggleObtainedSchema,
  updateShoppingListItemQuantitySchema,
} from "../validation/shoppingList.validation";

const shoppingListRoutes = new Hono();

// Get user's shopping list with details
shoppingListRoutes.get(
  "/",
  authenticate,
  shoppingListControllers.getShoppingList
);

// Toggle obtained status of an item
shoppingListRoutes.patch(
  "/toggle-obtained",
  authenticate,
  validate("json", toggleObtainedSchema),
  shoppingListControllers.toggleObtained
);

// Remove an item from shopping list
shoppingListRoutes.delete(
  "/item",
  authenticate,
  validate("json", removeShoppingListItemSchema),
  shoppingListControllers.removeShoppingListItem
);

// Update quantity of a shopping list item
shoppingListRoutes.patch(
  "/item/quantity",
  authenticate,
  validate("json", updateShoppingListItemQuantitySchema),
  shoppingListControllers.updateShoppingListItemQuantity
);

// Add a manual item to shopping list
shoppingListRoutes.post(
  "/item",
  authenticate,
  validate("json", addManualShoppingListItemSchema),
  shoppingListControllers.addManualShoppingListItem
);

// Clear all items from shopping list
shoppingListRoutes.delete(
  "/",
  authenticate,
  shoppingListControllers.clearShoppingList
);

export default shoppingListRoutes;
