import { prisma } from "@/lib/prisma";
import { CreateRecipeInput, Recipe } from "@/data/types";
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
  const recipe = await prisma.recipe.create({
    data: {
      ...data,
      notes: data.notes || [],
      createdById: userId,
      approved: isApproved,
    },
    include: recipeCategoriesInclude,
  });

  if (!recipe) {
    throw new ValidationError("Failed to retrieve created recipe");
  }

  return recipe;
}
