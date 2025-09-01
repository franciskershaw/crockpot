"use server";

import {
  getItems as getItemsFromDAL,
  getIngredients as getIngredientsFromDAL,
} from "@/data/items/getItems";
import { getItemCategories as getItemCategoriesFromDAL } from "@/data/items/getItemCategories";
import {
  createPublicAction,
  Permission,
  withPermissionAndValidation,
  revalidateItemCache,
} from "@/lib/action-helpers";
import { createItem as createItemFromDAL } from "@/data/items/createItem";
import { createItemSchema } from "@/lib/validations";
import { validateItemReferences } from "@/lib/security";

export const getItems = createPublicAction(async () => {
  return await getItemsFromDAL();
});

export const getIngredients = createPublicAction(async () => {
  return await getIngredientsFromDAL();
});

export const getItemCategories = createPublicAction(async () => {
  return await getItemCategoriesFromDAL();
});

export const createItem = withPermissionAndValidation(
  Permission.CREATE_ITEMS,
  createItemSchema,
  async (validatedInput) => {
    // Validate references (category and units exist)
    await validateItemReferences(validatedInput);

    // Create the item
    const item = await createItemFromDAL(validatedInput);

    // Revalidate cache using centralized utility
    await revalidateItemCache();

    return {
      success: true,
      item,
      message: "Item created successfully!",
    };
  }
);
