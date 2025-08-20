import { prisma } from "@/lib/prisma";
import { RecipeMenu, MenuHistoryEntry } from "@/data/types";
import { rebuildShoppingListForUser } from "@/data/shopping-list/shoppingList";

// Helper function to update history when adding or removing a recipe from menu
function updateHistory(
  currentHistory: MenuHistoryEntry[],
  recipeId: string,
  action: "add" | "remove"
): MenuHistoryEntry[] {
  const now = new Date();
  const existingHistoryEntry = currentHistory.find(
    (entry) => entry.recipeId === recipeId
  );

  if (existingHistoryEntry) {
    // Update existing history entry
    return currentHistory.map((entry) =>
      entry.recipeId === recipeId
        ? {
            ...entry,
            ...(action === "add" && {
              timesAddedToMenu: (entry.timesAddedToMenu || 0) + 1,
              lastAddedToMenu: now,
            }),
            ...(action === "remove" && {
              lastRemovedFromMenu: now,
            }),
          }
        : entry
    );
  } else {
    // Create new history entry
    const newHistoryEntry: MenuHistoryEntry = {
      recipeId,
      timesAddedToMenu: 1,
      firstAddedToMenu: now,
      lastAddedToMenu: now,
      lastRemovedFromMenu: now,
    };
    return [...currentHistory, newHistoryEntry];
  }
}

export async function createMenu(userId: string): Promise<RecipeMenu> {
  const menu = await prisma.recipeMenu.create({
    data: {
      userId,
      entries: [],
      history: [],
    },
  });

  return menu as RecipeMenu;
}

export async function addRecipeToMenu(
  userId: string,
  recipeId: string,
  serves: number
): Promise<{ menu: RecipeMenu; wasUpdate: boolean }> {
  // Get current menu
  const existingMenu = await prisma.recipeMenu.findUnique({
    where: { userId },
  });

  // Check if recipe already exists in menu
  const existingEntryIndex =
    existingMenu?.entries.findIndex((entry) => entry.recipeId === recipeId) ??
    -1;

  let updatedEntries;
  const wasUpdate = !!(existingMenu && existingEntryIndex >= 0);

  if (wasUpdate) {
    // Update existing entry
    updatedEntries = existingMenu.entries.map((entry, index) =>
      index === existingEntryIndex ? { ...entry, serves } : entry
    );
  } else if (existingMenu) {
    // Add new entry to existing menu
    updatedEntries = [...existingMenu.entries, { recipeId, serves }];
  } else {
    // Create new menu with first entry
    updatedEntries = [{ recipeId, serves }];
  }

  // Update history
  const currentHistory = existingMenu?.history || [];
  const updatedHistory = updateHistory(currentHistory, recipeId, "add");

  const updatedMenu = await prisma.recipeMenu.upsert({
    where: { userId },
    create: {
      userId,
      entries: updatedEntries,
      history: updatedHistory,
    },
    update: {
      entries: updatedEntries,
      history: updatedHistory,
      updatedAt: new Date(),
    },
  });

  // Rebuild shopping list based on the updated menu
  await rebuildShoppingListForUser(userId);

  return { menu: updatedMenu as RecipeMenu, wasUpdate };
}

export async function removeRecipeFromMenu(
  userId: string,
  recipeId: string
): Promise<RecipeMenu | null> {
  const existingMenu = await prisma.recipeMenu.findUnique({
    where: { userId },
  });

  if (!existingMenu) {
    return null;
  }

  const updatedEntries = existingMenu.entries.filter(
    (entry) => entry.recipeId !== recipeId
  );

  // Update history
  const updatedHistory = updateHistory(
    existingMenu.history,
    recipeId,
    "remove"
  );

  const updatedMenu = await prisma.recipeMenu.update({
    where: { userId },
    data: {
      entries: updatedEntries,
      history: updatedHistory,
      updatedAt: new Date(),
    },
  });

  // Rebuild shopping list based on the updated menu
  await rebuildShoppingListForUser(userId);

  return updatedMenu as RecipeMenu;
}

export async function removeAllRecipesFromMenu(
  userId: string
): Promise<RecipeMenu | null> {
  const existingMenu = await prisma.recipeMenu.findUnique({
    where: { userId },
  });

  if (!existingMenu) {
    return null;
  }

  // Update history for all removed recipes
  let updatedHistory = existingMenu.history;
  for (const entry of existingMenu.entries) {
    updatedHistory = updateHistory(updatedHistory, entry.recipeId, "remove");
  }

  const updatedMenu = await prisma.recipeMenu.update({
    where: { userId },
    data: {
      entries: [],
      history: updatedHistory,
      updatedAt: new Date(),
    },
  });

  // Rebuild shopping list based on the updated menu
  await rebuildShoppingListForUser(userId);

  return updatedMenu as RecipeMenu;
}
