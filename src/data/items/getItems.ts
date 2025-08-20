import { prisma } from "@/lib/prisma";
import { itemWithCategoryInclude } from "@/data/fragments/query-fragments";

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
      return items;
    },
    ["items"],
    {
      revalidate: 1800, // Cache for 30 minutes
      tags: ["items"],
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
        include: itemWithCategoryInclude,
      });
      return ingredients;
    },
    ["ingredients"],
    {
      revalidate: 1800, // Cache for 30 minutes  
      tags: ["items", "ingredients"],
    }
  );

  return getCachedIngredients();
}
