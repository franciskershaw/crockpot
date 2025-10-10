"use server";

// Favourites actions
import {
  addRecipeToFavourites as addRecipeToFavouritesFromDAL,
  removeRecipeFromFavourites as removeRecipeFromFavouritesFromDAL,
  clearUserFavourites as clearUserFavouritesFromDAL,
} from "@/data/user/updateFavourites";
import { getUserFavourites as getUserFavouritesFromDAL } from "@/data/user/getUserFavourites";
import {
  addToFavouritesSchema,
  removeFromFavouritesSchema,
} from "@/lib/validations";
import {
  withAuthentication,
  withAuthAndValidation,
} from "@/lib/action-helpers";
import { getRecipeById as getRecipeByIdFromDAL } from "@/data/recipes/getRecipeById";
import { NotFoundError } from "@/lib/errors";

// Get user's favourite recipes
export const getUserFavourites = withAuthentication(async (userId) => {
  return await getUserFavouritesFromDAL(userId);
});

// Add recipe to favourites
export const addRecipeToFavourites = withAuthAndValidation(
  addToFavouritesSchema,
  async (validatedInput, userId) => {
    // Verify recipe exists
    const recipe = await getRecipeByIdFromDAL(validatedInput.recipeId);
    if (!recipe) {
      throw new NotFoundError("Recipe", validatedInput.recipeId);
    }

    const result = await addRecipeToFavouritesFromDAL(
      userId,
      validatedInput.recipeId
    );

    return result;
  }
);

// Remove recipe from favourites
export const removeRecipeFromFavourites = withAuthAndValidation(
  removeFromFavouritesSchema,
  async (validatedInput, userId) => {
    const result = await removeRecipeFromFavouritesFromDAL(
      userId,
      validatedInput.recipeId
    );

    return result;
  }
);

// Clear all user favourites
export const clearUserFavourites = withAuthentication(async (userId) => {
  await clearUserFavouritesFromDAL(userId);
  return { success: true };
});
