import { prisma } from "@/lib/prisma";
import { Recipe } from "@/data/types";
import { validateUserId } from "@/lib/security";
import { 
  recipeWithDetailsInclude, 
  recentFirstOrderBy,
  approvedRecipesWhere 
} from "@/data/fragments/query-fragments";

export async function getUserCreatedRecipes(userId: string): Promise<Recipe[]> {
  validateUserId(userId);
  const recipes = await prisma.recipe.findMany({
    where: {
      createdById: userId,
      ...approvedRecipesWhere,
    },
    include: recipeWithDetailsInclude,
    orderBy: recentFirstOrderBy,
  });

  // Transform to match Recipe type with ingredients
  const recipesWithIngredients = recipes.map((recipe) => ({
    ...recipe,
    ingredients: recipe.ingredients.map((ing) => ({
      itemId: ing.itemId,
      unitId: ing.unitId,
      quantity: ing.quantity,
      item: undefined, // Will be populated if needed
      unit: undefined, // Will be populated if needed
    })),
  }));

  return recipesWithIngredients as Recipe[];
}
