import { prisma } from "@/lib/prisma";
import { CreateRecipeInput, Recipe } from "@/data/types";
import { UpdateRecipeInput } from "@/lib/validations";
import { ValidationError } from "@/lib/errors";
import { recipeCategoriesInclude } from "../fragments/query-fragments";

/**
 * Creates a new recipe in the database
 * @param userId - ID of the user creating the recipe
 * @param data - Validated recipe creation data
 * @returns The created recipe with all populated relations
 */
export async function createRecipe(
  userId: string,
  data: CreateRecipeInput,
  isApproved: boolean = false
): Promise<Recipe> {
  // Create the recipe using spread operator for cleaner code
  const recipe = await prisma.recipe.create({
    data: {
      ...data,
      notes: data.notes || [], // Ensure notes is always an array
      createdById: userId,
      approved: isApproved, // Auto-approve if user is admin
    },
    include: recipeCategoriesInclude,
  });

  if (!recipe) {
    throw new ValidationError("Failed to retrieve created recipe");
  }

  return recipe;
}

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
