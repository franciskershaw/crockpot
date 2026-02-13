import { Context } from "hono";

import { NotFoundError } from "../../../core/utils/errors";
import { rebuildShoppingListForUser } from "../../shopping-list/services/shoppingList.service";
import RecipeMenu, { IMenuHistoryEntry } from "../model/recipeMenu.model";

// Helper function to update history when removing recipes
const updateHistoryForRemoval = (
  currentHistory: IMenuHistoryEntry[],
  entries: Array<{ recipeId: any }>
): IMenuHistoryEntry[] => {
  const now = new Date();
  let updatedHistory = [...currentHistory];

  for (const entry of entries) {
    if (!entry.recipeId) continue; // Skip if no recipeId
    
    const existingHistoryIndex = updatedHistory.findIndex(
      (h) => h.recipeId?.toString() === entry.recipeId.toString()
    );

    if (existingHistoryIndex >= 0) {
      updatedHistory[existingHistoryIndex] = {
        ...updatedHistory[existingHistoryIndex],
        lastRemovedFromMenu: now,
      };
    }
  }

  return updatedHistory;
};

const clearMenu = async (c: Context) => {
  const userId = c.get("user")?._id;

  if (!userId) {
    throw new NotFoundError("User not found");
  }

  const menu = await RecipeMenu.findOne({ userId });

  if (!menu) {
    throw new NotFoundError("Menu not found");
  }

  // Update history for all removed recipes
  const updatedHistory = updateHistoryForRemoval(menu.history, menu.entries);

  // Clear all entries
  menu.entries = [];
  menu.history = updatedHistory;
  await menu.save();

  // Rebuild shopping list (will be empty since menu is empty)
  await rebuildShoppingListForUser(userId);

  return c.json({ menu, message: "Menu cleared successfully" }, 200);
};

export default clearMenu;
