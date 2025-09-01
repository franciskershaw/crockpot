"use server";

import {
  getItems as getItemsFromDAL,
  getIngredients as getIngredientsFromDAL,
} from "@/data/items/getItems";
import { getItemCategories as getItemCategoriesFromDAL } from "@/data/items/getItemCategories";
import {
  createPublicAction,
  Permission,
  withPermission,
  extractItemFormData,
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

export const createItem = withPermission(
  Permission.CREATE_ITEMS,
  async (_, formData: FormData) => {
    // Extract form data
    const extractedData = extractItemFormData(formData);

    // Validate the data
    const validatedInput = createItemSchema.parse(extractedData);

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
