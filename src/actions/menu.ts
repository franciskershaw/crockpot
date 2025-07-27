"use server";

// Menu actions
import { getUserMenu as getUserMenuFromDAL } from "@/data/menu/getMenus";
import {
  addRecipeToMenu as addRecipeToMenuFromDAL,
  updateMenuEntryServes as updateMenuEntryServesFromDAL,
  removeRecipeFromMenu as removeRecipeFromMenuFromDAL,
  deleteMenu as deleteMenuFromDAL,
} from "@/data/menu/menuMutations";
import {
  addToMenuSchema,
  updateMenuEntrySchema,
  removeFromMenuSchema,
  type AddToMenuInput,
  type UpdateMenuEntryInput,
  type RemoveFromMenuInput,
} from "@/lib/validations";
import { getAuthenticatedUserId, validateInput } from "@/lib/action-helpers";
import { getRecipeById as getRecipeByIdFromDAL } from "@/data/recipes/getRecipeById";

// Get user's menu with recipes
export async function getUserMenu() {
  const userId = await getAuthenticatedUserId();
  return await getUserMenuFromDAL(userId);
}

// Add recipe to menu (creates menu if none exists)
export async function addRecipeToMenu(input: AddToMenuInput) {
  const userId = await getAuthenticatedUserId();
  const validatedInput = validateInput(addToMenuSchema, input);

  // Verify recipe exists
  const recipe = await getRecipeByIdFromDAL(validatedInput.recipeId);
  if (!recipe) {
    throw new Error("Recipe not found");
  }

  const updatedMenu = await addRecipeToMenuFromDAL(
    userId,
    validatedInput.recipeId,
    validatedInput.serves
  );

  // TODO: Update user's shopping list based on the added recipe and serving size

  return updatedMenu;
}

// Update serves amount for a recipe in menu
export async function updateMenuEntryServes(input: UpdateMenuEntryInput) {
  const userId = await getAuthenticatedUserId();
  const validatedInput = validateInput(updateMenuEntrySchema, input);

  // Verify user has a menu
  const menu = await getUserMenuFromDAL(userId);
  if (!menu) {
    throw new Error("Menu not found");
  }

  // Verify recipe exists in menu
  const hasRecipe = menu.entries.some(
    (entry) => entry.recipeId === validatedInput.recipeId
  );
  if (!hasRecipe) {
    throw new Error("Recipe not found in menu");
  }

  const updatedMenu = await updateMenuEntryServesFromDAL(
    userId,
    validatedInput.recipeId,
    validatedInput.serves
  );

  // TODO: Update user's shopping list to reflect the new serving size

  return updatedMenu;
}

// Remove recipe from menu
export async function removeRecipeFromMenu(input: RemoveFromMenuInput) {
  const userId = await getAuthenticatedUserId();
  const validatedInput = validateInput(removeFromMenuSchema, input);

  // Verify user has a menu
  const menu = await getUserMenuFromDAL(userId);
  if (!menu) {
    throw new Error("Menu not found");
  }

  // Verify recipe exists in menu
  const hasRecipe = menu.entries.some(
    (entry) => entry.recipeId === validatedInput.recipeId
  );
  if (!hasRecipe) {
    throw new Error("Recipe not found in menu");
  }

  const updatedMenu = await removeRecipeFromMenuFromDAL(
    userId,
    validatedInput.recipeId
  );

  // TODO: Remove recipe ingredients from user's shopping list or adjust quantities

  return updatedMenu;
}

// Delete entire menu (clear all recipes at once)
export async function deleteMenu() {
  const userId = await getAuthenticatedUserId();

  // Verify user has a menu
  const menu = await getUserMenuFromDAL(userId);
  if (!menu) {
    throw new Error("Menu not found");
  }

  await deleteMenuFromDAL(userId);

  // TODO: Remove all recipe ingredients from user's shopping list when menu is deleted

  return { success: true };
}
