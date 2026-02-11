import { Context } from "hono";

import mongoose from "mongoose";

import { NotFoundError } from "../../../core/utils/errors";
import Recipe from "../../recipes/model/recipe.model";
import { rebuildShoppingListForUser } from "../../shopping-list/services/shoppingList.service";
import RecipeMenu, { IMenuHistoryEntry } from "../model/recipeMenu.model";
import { AddToMenuInput } from "../validation/menu.validation";

// Helper function to update history when adding a recipe
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
      timesAddedToMenu: updated[existingHistoryIndex].timesAddedToMenu + 1,
      lastAddedToMenu: now,
    };
    return updated;
  } else {
    // Create new history entry
    return [
      ...currentHistory,
      {
        recipeId,
        timesAddedToMenu: 1,
        firstAddedToMenu: now,
        lastAddedToMenu: now,
        lastRemovedFromMenu: now,
      },
    ];
  }
};

const addToMenu = async (c: Context) => {
  const userId = c.get("user")?._id;

  if (!userId) {
    throw new NotFoundError("User not found");
  }

  const body = await c.req.json<AddToMenuInput>();
  const { recipeId, serves } = body;

  // Verify recipe exists
  const recipe = await Recipe.findById(recipeId).lean();

  if (!recipe) {
    throw new NotFoundError("Recipe not found");
  }

  const recipeObjectId = new mongoose.Types.ObjectId(recipeId);

  // Find existing menu
  let menu = await RecipeMenu.findOne({ userId });

  if (!menu) {
    // Create new menu
    const updatedHistory = updateHistory([], recipeObjectId);
    menu = await RecipeMenu.create({
      userId,
      entries: [{ recipeId: recipeObjectId, serves }],
      history: updatedHistory,
    });

    return c.json(
      { menu, wasUpdate: false, message: "Recipe added to menu" },
      200
    );
  }

  // Check if recipe already exists in menu
  const existingEntryIndex = menu.entries.findIndex(
    (entry) => entry.recipeId.toString() === recipeId
  );

  if (existingEntryIndex >= 0) {
    // Update existing entry
    menu.entries[existingEntryIndex].serves = serves;
  } else {
    // Add new entry
    menu.entries.push({ recipeId: recipeObjectId, serves });
  }

  // Update history
  menu.history = updateHistory(menu.history, recipeObjectId);

  await menu.save();

  // Rebuild shopping list after menu update
  await rebuildShoppingListForUser(userId);

  return c.json(
    {
      menu,
      wasUpdate: existingEntryIndex >= 0,
      message:
        existingEntryIndex >= 0
          ? "Recipe serves updated in menu"
          : "Recipe added to menu",
    },
    200
  );
};

export default addToMenu;
