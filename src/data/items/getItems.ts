import { prisma } from "../../../prisma/prisma";

export const HOUSE_CATEGORY_ID = "6310a881b61a0ace3a1281ec";
export const WATER_ITEM_ID = "6310ad7242687f4a1cf7f26a";

export async function getItems() {
  const items = await prisma.item.findMany({
    orderBy: { name: "asc" },
    where: {
      id: {
        not: WATER_ITEM_ID,
      },
    },
    include: {
      category: true,
    },
  });

  return items;
}

export async function getIngredients() {
  const ingredients = await prisma.item.findMany({
    where: {
      categoryId: {
        not: HOUSE_CATEGORY_ID,
      },
    },
    include: {
      category: true,
    },
  });

  return ingredients;
}
