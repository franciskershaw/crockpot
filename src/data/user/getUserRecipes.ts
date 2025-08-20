import { prisma } from "../../../prisma/prisma";
import { Recipe } from "../types";

export async function getUserCreatedRecipes(userId: string): Promise<Recipe[]> {
  const recipes = await prisma.recipe.findMany({
    where: { 
      createdById: userId,
      approved: true // Only return approved recipes
    },
    include: {
      categories: true,
      createdBy: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc", // Most recent first
    },
  });

  // Transform to match Recipe type with ingredients
  const recipesWithIngredients = recipes.map((recipe) => ({
    ...recipe,
    ingredients: recipe.ingredients.map((ing) => ({
      itemId: ing.itemId,
      unitId: ing.unitId,
      quantity: ing.quantity,
      item: null, // Will be populated if needed
      unit: null, // Will be populated if needed
    })),
  }));

  return recipesWithIngredients as Recipe[];
}
