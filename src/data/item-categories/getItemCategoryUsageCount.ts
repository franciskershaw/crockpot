import { prisma } from "@/lib/prisma";

export async function getItemCategoryUsageCount(
  itemCategoryId: string
): Promise<number> {
  return prisma.item.count({ where: { categoryId: itemCategoryId } });
}
