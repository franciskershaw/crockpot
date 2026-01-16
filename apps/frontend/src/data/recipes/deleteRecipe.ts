import { ValidationError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import { recipeCategoriesInclude } from "../fragments/query-fragments";
import { Recipe } from "@/data/types";

/**
 * Deletes a recipe from the database
 * @param recipeId - ID of the recipe to delete
 * @returns The deleted recipe with all populated relations
 */
export async function deleteRecipe(recipeId: string): Promise<Recipe> {
  // First, verify the recipe exists and get its data
  const existingRecipe = await prisma.recipe.findUnique({
    where: { id: recipeId },
    include: recipeCategoriesInclude,
  });

  if (!existingRecipe) {
    throw new ValidationError("Recipe not found");
  }

  // Delete the recipe
  const deletedRecipe = await prisma.recipe.delete({
    where: { id: recipeId },
    include: recipeCategoriesInclude,
  });

  if (!deletedRecipe) {
    throw new ValidationError("Failed to delete recipe");
  }

  return deletedRecipe;
}
