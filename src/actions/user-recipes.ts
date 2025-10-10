"use server";

import { withAuthentication } from "@/lib/action-helpers";
import { getUserCreatedRecipes as getUserCreatedRecipesFromDAL } from "@/data/user/getUserRecipes";

// Get user's created recipes
export const getUserCreatedRecipes = withAuthentication(async (userId) => {
  return await getUserCreatedRecipesFromDAL(userId);
});
