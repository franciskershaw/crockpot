"use server";

// Favourites actions
import {
  addRecipeToFavourites as addRecipeToFavouritesFromDAL,
  removeRecipeFromFavourites as removeRecipeFromFavouritesFromDAL,
  getUserFavourites as getUserFavouritesFromDAL,
  clearUserFavourites as clearUserFavouritesFromDAL,
} from "@/data/user/updateFavourites";
import {
  addToFavouritesSchema,
  removeFromFavouritesSchema,
  type AddToFavouritesInput,
  type RemoveFromFavouritesInput,
} from "@/lib/validations";
import { getAuthenticatedUserId, validateInput } from "@/lib/action-helpers";
import { getRecipeById as getRecipeByIdFromDAL } from "@/data/recipes/getRecipeById";
import {
  NotFoundError,
  ServerError,
  AuthError,
  ValidationError,
} from "@/lib/errors";

// Get user's favourite recipes
export async function getUserFavourites() {
  try {
    const userId = await getAuthenticatedUserId();
    return await getUserFavouritesFromDAL(userId);
  } catch (error) {
    if (error instanceof Error && error.message.includes("Authentication")) {
      throw error; // Re-throw auth errors as-is
    }
    throw new ServerError("Failed to retrieve favourites");
  }
}

// Add recipe to favourites
export async function addRecipeToFavourites(input: AddToFavouritesInput) {
  try {
    const userId = await getAuthenticatedUserId();
    const validatedInput = validateInput(addToFavouritesSchema, input);

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
  } catch (error) {
    if (
      error instanceof AuthError ||
      error instanceof ValidationError ||
      error instanceof NotFoundError
    ) {
      throw error; // Re-throw known errors as-is
    }
    throw new ServerError("Failed to add recipe to favourites");
  }
}

// Remove recipe from favourites
export async function removeRecipeFromFavourites(
  input: RemoveFromFavouritesInput
) {
  try {
    const userId = await getAuthenticatedUserId();
    const validatedInput = validateInput(removeFromFavouritesSchema, input);

    // Verify recipe exists
    const recipe = await getRecipeByIdFromDAL(validatedInput.recipeId);
    if (!recipe) {
      throw new NotFoundError("Recipe", validatedInput.recipeId);
    }

    const result = await removeRecipeFromFavouritesFromDAL(
      userId,
      validatedInput.recipeId
    );

    return result;
  } catch (error) {
    if (
      error instanceof AuthError ||
      error instanceof ValidationError ||
      error instanceof NotFoundError
    ) {
      throw error; // Re-throw known errors as-is
    }
    throw new ServerError("Failed to remove recipe from favourites");
  }
}

// Clear all user favourites
export async function clearUserFavourites() {
  try {
    const userId = await getAuthenticatedUserId();

    await clearUserFavouritesFromDAL(userId);

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      throw error; // Re-throw known errors as-is
    }
    throw new ServerError("Failed to clear favourites");
  }
}
