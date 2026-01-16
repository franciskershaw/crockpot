"use server";

import { withAuthentication } from "@/lib/action-helpers";
import { getUserCreatedRecipes as getUserCreatedRecipesFromDAL } from "@/data/user/getUserRecipes";
import { getUserRecipeCount as getUserRecipeCountFromDAL } from "@/data/recipes/getUserRecipeCount";

// Get user's created recipes
export const getUserCreatedRecipes = withAuthentication(async (userId) => {
  return await getUserCreatedRecipesFromDAL(userId);
});

// Get user's recipe count
export const getUserRecipeCount = withAuthentication(async (userId) => {
  return await getUserRecipeCountFromDAL(userId);
});
