import { prisma } from "@/lib/prisma";
import { RecipeMenu } from "../types";

export async function getUserMenu(userId: string): Promise<RecipeMenu | null> {
  const menu = await prisma.recipeMenu.findUnique({
    where: { userId },
  });

  if (!menu) {
    return null;
  }

  // Get all recipes for the menu entries
  const recipeIds = menu.entries.map((entry) => entry.recipeId);
  const recipes = await prisma.recipe.findMany({
    where: { id: { in: recipeIds } },
    include: { categories: true },
  });

  // Map recipes to entries
  const entriesWithRecipes = menu.entries.map((entry) => ({
    ...entry,
    recipe: recipes.find((recipe) => recipe.id === entry.recipeId),
  }));

  return {
    ...menu,
    entries: entriesWithRecipes,
  } as RecipeMenu;
}
