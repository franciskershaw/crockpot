import { prisma } from "@/lib/prisma";

// Helper function to validate MongoDB ObjectId
function isValidObjectId(id: string): boolean {
  // MongoDB ObjectId is exactly 24 hex characters
  return /^[0-9a-fA-F]{24}$/.test(id);
}

export async function getRecipeById(id: string) {
  // Validate the ID format before making the database query
  if (!isValidObjectId(id)) {
    return null;
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
