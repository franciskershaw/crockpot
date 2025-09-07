import { prisma } from "@/lib/prisma";
import { itemWithCategoryInclude } from "@/data/fragments/query-fragments";
import { queryKeys } from "@/lib/constants";

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
        include: itemWithCategoryInclude,
      });

      // Get all unique unit IDs from all items
      const allUnitIds = [
        ...new Set(items.flatMap((item) => item.allowedUnitIds)),
      ];

      // Fetch all units in one query
      const units = await prisma.unit.findMany({
        where: {
          id: { in: allUnitIds },
        },
        select: {
          id: true,
          name: true,
          abbreviation: true,
        },
      });

      // Create a map for quick unit lookups
      const unitsMap = new Map(units.map((unit) => [unit.id, unit]));

      // Transform items to include allowed units
      return items.map((item) => ({
        ...item,
        allowedUnits: item.allowedUnitIds
          .map((unitId) => unitsMap.get(unitId))
          .filter(Boolean) as Array<{
          id: string;
          name: string;
          abbreviation: string;
        }>,
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
      const ingredients = await prisma.item.findMany({
        where: {
          categoryId: {
            not: HOUSE_CATEGORY_ID,
          },
        },
        orderBy: { name: "asc" },
        include: itemWithCategoryInclude,
      });
      return ingredients;
    },
    [queryKeys.INGREDIENTS],
    {
      revalidate: 1800, // Cache for 30 minutes
      tags: [queryKeys.ITEMS, queryKeys.INGREDIENTS],
    }
  );

  return getCachedIngredients();
}
