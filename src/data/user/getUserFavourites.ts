import { prisma } from "@/lib/prisma";
import { validateUserId } from "@/lib/security";
import { favouriteRecipesInclude } from "@/data/fragments/query-fragments";
import { Recipe } from "@/data/types";

export async function getUserFavourites(userId: string): Promise<Recipe[]> {
  validateUserId(userId);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: favouriteRecipesInclude,
  });

  if (!user) {
    return [];
  }

  return user.favouriteRecipes as Recipe[];
}
