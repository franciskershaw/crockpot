import { prisma } from "@/lib/prisma";
import { queryKeys } from "@/lib/constants";
import { itemWithRelationsInclude } from "@/data/fragments/query-fragments";

export const HOUSE_CATEGORY_ID = "6310a881b61a0ace3a1281ec";
export const WATER_ITEM_ID = "6310ad7242687f4a1cf7f26a";

export async function getItems() {
  const { unstable_cache } = await import("next/cache");

  const getCachedItems = unstable_cache(
    async () => {
      const items = await prisma.item.findMany({
        orderBy: { name: "asc" },
        where: {
          id: {
            not: WATER_ITEM_ID,
          },
        },
        include: itemWithRelationsInclude,
      });

      // Get all recipes with their ingredients to count usage efficiently
      const allRecipes = await prisma.recipe.findMany({
        select: {
          ingredients: {
            select: {
              itemId: true,
            },
          },
        },
      });

      // Count recipe usage for each item
      const recipeCountMap = new Map<string, number>();
      allRecipes.forEach((recipe) => {
        recipe.ingredients.forEach((ingredient) => {
          const currentCount = recipeCountMap.get(ingredient.itemId) || 0;
          recipeCountMap.set(ingredient.itemId, currentCount + 1);
        });
      });

      // Add recipe count to items (relations already included via Prisma)
      return items.map((item) => ({
        ...item,
        recipeCount: recipeCountMap.get(item.id) || 0,
      }));
    },
    [queryKeys.ITEMS],
    {
      revalidate: 1800, // Cache for 30 minutes
      tags: [queryKeys.ITEMS],
    }
  );

  return getCachedItems();
}

export async function getIngredients() {
  const { unstable_cache } = await import("next/cache");

  const getCachedIngredients = unstable_cache(
    async () => {
      return await prisma.item.findMany({
        where: {
          categoryId: {
            not: HOUSE_CATEGORY_ID,
          },
        },
        orderBy: { name: "asc" },
        include: itemWithRelationsInclude,
      });
    },
    [queryKeys.INGREDIENTS],
    {
      revalidate: 1800, // Cache for 30 minutes
      tags: [queryKeys.ITEMS, queryKeys.INGREDIENTS],
    }
  );

  return getCachedIngredients();
}
