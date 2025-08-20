"use server";

// Menu actions
import { getUserMenu as getUserMenuFromDAL } from "@/data/menu/getMenus";
import {
  addRecipeToMenu as addRecipeToMenuFromDAL,
  removeRecipeFromMenu as removeRecipeFromMenuFromDAL,
  removeAllRecipesFromMenu as removeAllRecipesFromMenuFromDAL,
} from "@/data/menu/menuMutations";
import { addToMenuSchema, removeFromMenuSchema } from "@/lib/validations";
import {
  withAuthentication,
  withAuthAndValidation,
} from "@/lib/action-helpers";
import { getRecipeById as getRecipeByIdFromDAL } from "@/data/recipes/getRecipeById";
import { NotFoundError } from "@/lib/errors";
import { revalidatePath } from "next/cache";
import {
  toggleObtainedForItem as toggleObtainedForItemDAL,
  removeItemFromShoppingList as removeItemFromShoppingListDAL,
  getUserShoppingListWithDetails,
  updateShoppingListItemQuantity as updateShoppingListItemQuantityDAL,
  addManualItemToShoppingList as addManualItemToShoppingListDAL,
  clearAllItemsFromShoppingList as clearAllItemsFromShoppingListDAL,
} from "@/data/shopping-list/shoppingList";
import {
  removeShoppingListItemSchema,
  toggleObtainedSchema,
  updateShoppingListItemQuantitySchema,
  addManualShoppingListItemSchema,
} from "@/lib/validations";

// Get user's menu with recipes
export const getUserMenu = withAuthentication(async (userId) => {
  return await getUserMenuFromDAL(userId);
});

// Add recipe to menu (creates menu if none exists)
export const addRecipeToMenu = withAuthAndValidation(
  addToMenuSchema,
  async (validatedInput, userId) => {
    // Verify recipe exists
    const recipe = await getRecipeByIdFromDAL(validatedInput.recipeId);
    if (!recipe) {
      throw new NotFoundError("Recipe", validatedInput.recipeId);
    }

    const result = await addRecipeToMenuFromDAL(
      userId,
      validatedInput.recipeId,
      validatedInput.serves
    );

    revalidatePath("/your-crockpot");
    return result;
  }
);

// Remove recipe from menu
export const removeRecipeFromMenu = withAuthAndValidation(
  removeFromMenuSchema,
  async (validatedInput, userId) => {
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

    revalidatePath("/your-crockpot");
    return updatedMenu;
  }
);

// Remove all recipes from menu
export const removeAllRecipesFromMenu = withAuthentication(async (userId) => {
  const updatedMenu = await removeAllRecipesFromMenuFromDAL(userId);
  revalidatePath("/your-crockpot");
  return updatedMenu;
});

// Shopping list actions
export const getShoppingList = withAuthentication(async (userId) => {
  return await getUserShoppingListWithDetails(userId);
});

export const toggleObtained = withAuthAndValidation(
  toggleObtainedSchema,
  async (validated, userId) => {
    const updated = await toggleObtainedForItemDAL(
      userId,
      validated.itemId,
      validated.unitId,
      validated.isManual
    );
    revalidatePath("/your-crockpot");
    return updated;
  }
);

export const removeShoppingListItem = withAuthAndValidation(
  removeShoppingListItemSchema,
  async (validated, userId) => {
    const updated = await removeItemFromShoppingListDAL(
      userId,
      validated.itemId,
      validated.unitId,
      validated.isManual
    );
    revalidatePath("/your-crockpot");
    return updated;
  }
);

export const updateShoppingListItemQuantity = withAuthAndValidation(
  updateShoppingListItemQuantitySchema,
  async (validated, userId) => {
    const updated = await updateShoppingListItemQuantityDAL(
      userId,
      validated.itemId,
      validated.unitId ?? null,
      validated.quantity,
      validated.isManual
    );
    revalidatePath("/your-crockpot");
    return updated;
  }
);

export const addManualShoppingListItem = withAuthAndValidation(
  addManualShoppingListItemSchema,
  async (validated, userId) => {
    const updated = await addManualItemToShoppingListDAL(
      userId,
      validated.itemId,
      validated.unitId ?? null,
      validated.quantity
    );
    revalidatePath("/your-crockpot");
    return updated;
  }
);

export const clearShoppingList = withAuthentication(async (userId) => {
  const updated = await clearAllItemsFromShoppingListDAL(userId);
  revalidatePath("/your-crockpot");
  return updated;
});
