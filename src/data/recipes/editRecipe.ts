import { ValidationError } from "@/lib/errors";
import { recipeCategoriesInclude } from "../fragments/query-fragments";
import { prisma } from "@/lib/prisma";
import { UpdateRecipeInput } from "@/lib/validations";
import { Recipe } from "@/data/types";

/**
 * Updates an existing recipe in the database
 * @param recipeId - ID of the recipe to update
 * @param data - Validated recipe update data
 * @returns The updated recipe with all populated relations
 */
export async function editRecipe(
  recipeId: string,
  data: UpdateRecipeInput
): Promise<Recipe> {
  // First, verify the recipe exists
  const existingRecipe = await prisma.recipe.findUnique({
    where: { id: recipeId },
    include: recipeCategoriesInclude,
  });

  if (!existingRecipe) {
    throw new ValidationError("Recipe not found");
  }

  // Prepare update data, handling optional fields
  const updateData: UpdateRecipeInput = {};

  if (data.name !== undefined) updateData.name = data.name;
  if (data.timeInMinutes !== undefined)
    updateData.timeInMinutes = data.timeInMinutes;
  if (data.instructions !== undefined)
    updateData.instructions = data.instructions;
  if (data.notes !== undefined) updateData.notes = data.notes;
  if (data.serves !== undefined) updateData.serves = data.serves;
  if (data.categoryIds !== undefined) updateData.categoryIds = data.categoryIds;
  if (data.ingredients !== undefined) updateData.ingredients = data.ingredients;
  if (data.image !== undefined) updateData.image = data.image;

  // Update the recipe
  const updatedRecipe = await prisma.recipe.update({
    where: { id: recipeId },
    data: updateData,
    include: recipeCategoriesInclude,
  });

  if (!updatedRecipe) {
    throw new ValidationError("Failed to update recipe");
  }

  return updatedRecipe;
}
