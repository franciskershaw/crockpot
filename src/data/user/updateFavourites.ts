import { prisma } from "@/lib/prisma";
import { Recipe } from "@/data/types";
import { validateUserId, validateRecipeId } from "@/lib/security";
import { favouriteRecipesInclude } from "@/data/fragments/query-fragments";

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

export async function addRecipeToFavourites(
  userId: string,
  recipeId: string
): Promise<{ wasAdded: boolean }> {
  validateUserId(userId);
  validateRecipeId(recipeId);
  // Check if recipe exists
  const recipe = await prisma.recipe.findUnique({
    where: { id: recipeId },
  });

  if (!recipe) {
    throw new Error("Recipe not found");
  }

  // Get current user
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Check if recipe is already favourited
  const isAlreadyFavourited = user.favouriteRecipeIds.includes(recipeId);

  if (isAlreadyFavourited) {
    return { wasAdded: false };
  }

  // Add recipe to favourites
  await prisma.user.update({
    where: { id: userId },
    data: {
      favouriteRecipeIds: {
        push: recipeId,
      },
    },
  });

  return { wasAdded: true };
}

export async function removeRecipeFromFavourites(
  userId: string,
  recipeId: string
): Promise<{ wasRemoved: boolean }> {
  validateUserId(userId);
  validateRecipeId(recipeId);
  // Get current user
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Check if recipe is in favourites
  const isFavourited = user.favouriteRecipeIds.includes(recipeId);

  if (!isFavourited) {
    return { wasRemoved: false };
  }

  // Remove recipe from favourites
  await prisma.user.update({
    where: { id: userId },
    data: {
      favouriteRecipeIds: {
        set: user.favouriteRecipeIds.filter((id) => id !== recipeId),
      },
    },
  });

  return { wasRemoved: true };
}

export async function clearUserFavourites(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: {
      favouriteRecipeIds: [],
    },
  });
}
