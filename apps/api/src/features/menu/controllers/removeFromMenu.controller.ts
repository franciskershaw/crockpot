import { Context } from "hono";

import mongoose from "mongoose";

import { NotFoundError } from "../../../core/utils/errors";
import { rebuildShoppingListForUser } from "../../shopping-list/services/shoppingList.service";
import RecipeMenu, { IMenuHistoryEntry } from "../model/recipeMenu.model";
import { RemoveFromMenuInput } from "../validation/menu.validation";

// Helper function to update history when removing a recipe
const updateHistory = (
  currentHistory: IMenuHistoryEntry[],
  recipeId: mongoose.Types.ObjectId
): IMenuHistoryEntry[] => {
  const now = new Date();
  const existingHistoryIndex = currentHistory.findIndex(
    (entry) => entry.recipeId.toString() === recipeId.toString()
  );

  if (existingHistoryIndex >= 0) {
    // Update existing history entry
    const updated = [...currentHistory];
    updated[existingHistoryIndex] = {
      ...updated[existingHistoryIndex],
      lastRemovedFromMenu: now,
    };
    return updated;
  }

  return currentHistory;
};

const removeFromMenu = async (c: Context) => {
  const userId = c.get("user")?._id;

  if (!userId) {
    throw new NotFoundError("User not found");
  }

  const body = await c.req.json<RemoveFromMenuInput>();
  const { recipeId } = body;

  const menu = await RecipeMenu.findOne({ userId });

  if (!menu) {
    throw new NotFoundError("Menu not found");
  }

  const recipeObjectId = new mongoose.Types.ObjectId(recipeId);

  // Check if recipe exists in menu
  const existingEntryIndex = menu.entries.findIndex(
    (entry) => entry.recipeId.toString() === recipeId
  );

  if (existingEntryIndex < 0) {
    return c.json({ wasRemoved: false, message: "Recipe not in menu" }, 200);
  }

  // Remove entry
  menu.entries = menu.entries.filter(
    (entry) => entry.recipeId.toString() !== recipeId
  );

  // Update history
  menu.history = updateHistory(menu.history, recipeObjectId);

  await menu.save();

  // Rebuild shopping list after menu update
  await rebuildShoppingListForUser(userId);

  return c.json({ wasRemoved: true, message: "Recipe removed from menu" }, 200);
};

export default removeFromMenu;
