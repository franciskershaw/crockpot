import { prisma } from "@/lib/prisma";

export async function getRecipeCategoryUsageCount(recipeCategoryId: string): Promise<number> {
  return prisma.recipe.count({ where: { categoryIds: { has: recipeCategoryId } } });
}


