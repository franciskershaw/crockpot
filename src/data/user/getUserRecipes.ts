import { prisma } from "@/lib/prisma";
import { Recipe } from "@/data/types";
import { validateUserId } from "@/lib/security";
import {
  recipeWithDetailsInclude,
  recentFirstOrderBy,
} from "@/data/fragments/query-fragments";

export async function getUserCreatedRecipes(userId: string): Promise<Recipe[]> {
  validateUserId(userId);
  const recipes = await prisma.recipe.findMany({
    where: {
      createdById: userId,
    },
    include: recipeWithDetailsInclude,
    orderBy: recentFirstOrderBy,
  });

  const recipesWithIngredients = recipes.map((recipe) => ({
    ...recipe,
    ingredients: recipe.ingredients.map((ing) => ({
      itemId: ing.itemId,
      unitId: ing.unitId,
      quantity: ing.quantity,
      item: undefined,
      unit: undefined,
    })),
  }));

  return recipesWithIngredients as Recipe[];
}
