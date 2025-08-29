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
