"use server";

// Menu actions
import { getUserMenu as getUserMenuFromDAL } from "@/data/menu/getMenus";
import {
  addRecipeToMenu as addRecipeToMenuFromDAL,
  removeRecipeFromMenu as removeRecipeFromMenuFromDAL,
  deleteMenu as deleteMenuFromDAL,
} from "@/data/menu/menuMutations";
import {
  addToMenuSchema,
  removeFromMenuSchema,
  type AddToMenuInput,
  type RemoveFromMenuInput,
} from "@/lib/validations";
import { getAuthenticatedUserId, validateInput } from "@/lib/action-helpers";
import { getRecipeById as getRecipeByIdFromDAL } from "@/data/recipes/getRecipeById";
import {
  NotFoundError,
  ServerError,
  AuthError,
  ValidationError,
} from "@/lib/errors";

// Get user's menu with recipes
export async function getUserMenu() {
  try {
    const userId = await getAuthenticatedUserId();
    return await getUserMenuFromDAL(userId);
  } catch (error) {
    if (error instanceof Error && error.message.includes("Authentication")) {
      throw error; // Re-throw auth errors as-is
    }
    throw new ServerError("Failed to retrieve menu");
  }
}

// Add recipe to menu (creates menu if none exists)
export async function addRecipeToMenu(input: AddToMenuInput) {
  try {
    const userId = await getAuthenticatedUserId();
    const validatedInput = validateInput(addToMenuSchema, input);

    // Verify recipe exists
    const recipe = await getRecipeByIdFromDAL(validatedInput.recipeId);
    if (!recipe) {
      throw new NotFoundError("Recipe", validatedInput.recipeId);
    }

    const updatedMenu = await addRecipeToMenuFromDAL(
      userId,
      validatedInput.recipeId,
      validatedInput.serves
    );

    // TODO: Update user's shopping list based on the added recipe and serving size

    return updatedMenu;
  } catch (error) {
    if (
      error instanceof AuthError ||
      error instanceof ValidationError ||
      error instanceof NotFoundError
    ) {
      throw error; // Re-throw known errors as-is
    }
    throw new ServerError("Failed to add recipe to menu");
  }
}

// Remove recipe from menu
export async function removeRecipeFromMenu(input: RemoveFromMenuInput) {
  try {
    const userId = await getAuthenticatedUserId();
    const validatedInput = validateInput(removeFromMenuSchema, input);

    // Verify user has a menu
    const menu = await getUserMenuFromDAL(userId);
    if (!menu) {
      throw new NotFoundError("Menu");
    }

    // Verify recipe exists in menu
    const hasRecipe = menu.entries.some(
      (entry) => entry.recipeId === validatedInput.recipeId
    );
    if (!hasRecipe) {
      throw new NotFoundError("Recipe in menu", validatedInput.recipeId);
    }

    const updatedMenu = await removeRecipeFromMenuFromDAL(
      userId,
      validatedInput.recipeId
    );

    // TODO: Remove recipe ingredients from user's shopping list or adjust quantities

    return updatedMenu;
  } catch (error) {
    if (
      error instanceof AuthError ||
      error instanceof ValidationError ||
      error instanceof NotFoundError
    ) {
      throw error; // Re-throw known errors as-is
    }
    throw new ServerError("Failed to remove recipe from menu");
  }
}

// Delete entire menu (clear all recipes at once)
export async function deleteMenu() {
  try {
    const userId = await getAuthenticatedUserId();

    // Verify user has a menu
    const menu = await getUserMenuFromDAL(userId);
    if (!menu) {
      throw new NotFoundError("Menu");
    }

    await deleteMenuFromDAL(userId);

    // TODO: Remove all recipe ingredients from user's shopping list when menu is deleted

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError || error instanceof NotFoundError) {
      throw error; // Re-throw known errors as-is
    }
    throw new ServerError("Failed to delete menu");
  }
}
