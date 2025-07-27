import { prisma } from "@/lib/prisma";
import { RecipeMenu } from "../types";

export async function createMenu(userId: string): Promise<RecipeMenu> {
  const menu = await prisma.recipeMenu.create({
    data: {
      userId,
      entries: [],
    },
  });

  return menu as RecipeMenu;
}

export async function addRecipeToMenu(
  userId: string,
  recipeId: string,
  serves: number
): Promise<RecipeMenu> {
  // Get current menu
  const existingMenu = await prisma.recipeMenu.findUnique({
    where: { userId },
  });

  // Check if recipe already exists in menu
  const existingEntryIndex =
    existingMenu?.entries.findIndex((entry) => entry.recipeId === recipeId) ??
    -1;

  let updatedEntries;
  if (existingMenu && existingEntryIndex >= 0) {
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

  const updatedMenu = await prisma.recipeMenu.upsert({
    where: { userId },
    create: {
      userId,
      entries: updatedEntries,
    },
    update: {
      entries: updatedEntries,
      updatedAt: new Date(),
    },
  });

  return updatedMenu as RecipeMenu;
}

export async function updateMenuEntryServes(
  userId: string,
  recipeId: string,
  serves: number
): Promise<RecipeMenu> {
  const existingMenu = await prisma.recipeMenu.findUnique({
    where: { userId },
  });

  const updatedEntries = existingMenu!.entries.map((entry) =>
    entry.recipeId === recipeId ? { ...entry, serves } : entry
  );

  const updatedMenu = await prisma.recipeMenu.update({
    where: { userId },
    data: {
      entries: updatedEntries,
      updatedAt: new Date(),
    },
  });

  return updatedMenu as RecipeMenu;
}

export async function removeRecipeFromMenu(
  userId: string,
  recipeId: string
): Promise<RecipeMenu | null> {
  const existingMenu = await prisma.recipeMenu.findUnique({
    where: { userId },
  });

  const updatedEntries = existingMenu!.entries.filter(
    (entry) => entry.recipeId !== recipeId
  );

  // If no entries left, delete the menu
  if (updatedEntries.length === 0) {
    await prisma.recipeMenu.delete({
      where: { userId },
    });
    return null;
  }

  const updatedMenu = await prisma.recipeMenu.update({
    where: { userId },
    data: {
      entries: updatedEntries,
      updatedAt: new Date(),
    },
  });

  return updatedMenu as RecipeMenu;
}

export async function deleteMenu(userId: string): Promise<void> {
  await prisma.recipeMenu.delete({
    where: { userId },
  });
}
