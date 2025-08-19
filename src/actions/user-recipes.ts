"use server";

import { getAuthenticatedUserId } from "@/lib/action-helpers";
import { ServerError } from "@/lib/errors";
import { getUserCreatedRecipes as getUserCreatedRecipesFromDAL } from "@/data/user/getUserRecipes";

// Get user's created recipes
export async function getUserCreatedRecipes() {
  try {
    const userId = await getAuthenticatedUserId();
    return await getUserCreatedRecipesFromDAL(userId);
  } catch (error) {
    if (error instanceof Error && error.message.includes("Authentication")) {
      throw error; // Re-throw auth errors as-is
    }
    throw new ServerError("Failed to retrieve user recipes");
  }
}
