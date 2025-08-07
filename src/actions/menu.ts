"use server";

// Menu actions
import { getUserMenu as getUserMenuFromDAL } from "@/data/menu/getMenus";
import {
  addRecipeToMenu as addRecipeToMenuFromDAL,
  removeRecipeFromMenu as removeRecipeFromMenuFromDAL,
  removeAllRecipesFromMenu as removeAllRecipesFromMenuFromDAL,
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
import { revalidatePath } from "next/cache";
import {
  toggleObtainedForItem as toggleObtainedForItemDAL,
  removeItemFromShoppingList as removeItemFromShoppingListDAL,
  getUserShoppingListWithDetails,
  updateShoppingListItemQuantity as updateShoppingListItemQuantityDAL,
} from "@/data/shopping-list/shoppingList";
import {
  removeShoppingListItemSchema,
  toggleObtainedSchema,
  type RemoveShoppingListItemInput,
  type ToggleObtainedInput,
  updateShoppingListItemQuantitySchema,
  type UpdateShoppingListItemQuantityInput,
} from "@/lib/validations";

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

    const result = await addRecipeToMenuFromDAL(
      userId,
      validatedInput.recipeId,
      validatedInput.serves
    );

    revalidatePath("/your-crockpot");
    return result;
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

    revalidatePath("/your-crockpot");
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

// Remove all recipes from menu
export async function removeAllRecipesFromMenu() {
  try {
    const userId = await getAuthenticatedUserId();
    const updatedMenu = await removeAllRecipesFromMenuFromDAL(userId);

    revalidatePath("/your-crockpot");
    return updatedMenu;
  } catch (error) {
    if (error instanceof AuthError || error instanceof NotFoundError) {
      throw error; // Re-throw known errors as-is
    }
  }
}

// Shopping list actions
export async function getShoppingList() {
  const userId = await getAuthenticatedUserId();
  return await getUserShoppingListWithDetails(userId);
}

export async function toggleObtained(input: ToggleObtainedInput) {
  try {
    const userId = await getAuthenticatedUserId();
    const validated = validateInput(toggleObtainedSchema, input);
    const updated = await toggleObtainedForItemDAL(
      userId,
      validated.itemId,
      validated.unitId
    );
    revalidatePath("/your-crockpot");
    return updated;
  } catch (error) {
    if (error instanceof AuthError || error instanceof ValidationError) {
      throw error;
    }
    throw new ServerError("Failed to update shopping list");
  }
}

export async function removeShoppingListItem(
  input: RemoveShoppingListItemInput
) {
  try {
    const userId = await getAuthenticatedUserId();
    const validated = validateInput(removeShoppingListItemSchema, input);
    const updated = await removeItemFromShoppingListDAL(
      userId,
      validated.itemId,
      validated.unitId
    );
    revalidatePath("/your-crockpot");
    return updated;
  } catch (error) {
    if (error instanceof AuthError || error instanceof ValidationError) {
      throw error;
    }
    throw new ServerError("Failed to update shopping list");
  }
}

export async function updateShoppingListItemQuantity(
  input: UpdateShoppingListItemQuantityInput
) {
  try {
    const userId = await getAuthenticatedUserId();
    const validated = validateInput(updateShoppingListItemQuantitySchema, input);
    const updated = await updateShoppingListItemQuantityDAL(
      userId,
      validated.itemId,
      validated.unitId ?? null,
      validated.quantity
    );
    revalidatePath("/your-crockpot");
    return updated;
  } catch (error) {
    if (error instanceof AuthError || error instanceof ValidationError) {
      throw error;
    }
    throw new ServerError("Failed to update shopping list");
  }
}
