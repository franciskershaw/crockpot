import { prisma } from "@/lib/prisma";

export async function updateRecipeStatus(recipeId: string, approved: boolean) {
  const recipe = await prisma.recipe.update({
    where: { id: recipeId },
    data: { approved },
    select: {
      id: true,
      name: true,
      approved: true,
    },
  });

  return recipe;
}
