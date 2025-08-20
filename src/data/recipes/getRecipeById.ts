import { prisma } from "@/lib/prisma";
import { validateRecipeId } from "@/lib/security";
import { ValidationError } from "@/lib/errors";

export async function getRecipeById(id: string) {
  try {
    // Validate the ID format before making the database query
    validateRecipeId(id);
  } catch (error) {
    if (error instanceof ValidationError) {
      return null; // Invalid ID format, return null instead of throwing
    }
    throw error;
  }

  try {
    const recipe = await prisma.recipe.findUnique({
      where: { id, approved: true },
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
    });

    if (!recipe) {
      return null;
    }

    // Get the ingredient items separately since ingredients are embedded
    const ingredientItemIds = recipe.ingredients.map((ing) => ing.itemId);
    const items = await prisma.item.findMany({
      where: {
        id: { in: ingredientItemIds },
      },
      include: {
        category: true,
      },
    });

    // Get the units for ingredients that have unitId
    const unitIds = recipe.ingredients
      .map((ing) => ing.unitId)
      .filter(Boolean) as string[];

    const units =
      unitIds.length > 0
        ? await prisma.unit.findMany({
            where: {
              id: { in: unitIds },
            },
          })
        : [];

    // Create a map for quick lookups
    const itemsMap = new Map(items.map((item) => [item.id, item]));
    const unitsMap = new Map(units.map((unit) => [unit.id, unit]));

    // Enhance the recipe with populated ingredient data
    const enhancedRecipe = {
      ...recipe,
      ingredients: recipe.ingredients.map((ingredient) => ({
        ...ingredient,
        item: itemsMap.get(ingredient.itemId),
        unit: ingredient.unitId ? unitsMap.get(ingredient.unitId) : null,
      })),
    };

    return enhancedRecipe;
  } catch (error) {
    // Log the error for debugging but return null for invalid requests
    console.error("Error fetching recipe:", error);
    return null;
  }
}
