import { prisma } from "@/lib/prisma";

export async function bulkUpdateRecipeStatus(
  recipeIds: string[],
  approved: boolean
) {
  const result = await prisma.recipe.updateMany({
    where: { id: { in: recipeIds } },
    data: { approved },
  });

  return result;
}
