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
  withPermissionAndValidation,
  revalidateItemCache,
} from "@/lib/action-helpers";
import { createItem as createItemFromDAL } from "@/data/items/createItem";
import { updateItem as updateItemDAL } from "@/data/items/updateItem";
import { deleteItem as deleteItemDAL } from "@/data/items/deleteItem";
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

export const updateItem = withPermission(
  Permission.CREATE_ITEMS,
  async (
    _user,
    data: { name?: string; categoryId?: string; allowedUnitIds?: string[] },
    itemId: string
  ) => {
    // Validate references if they're being updated
    if (data.categoryId || data.allowedUnitIds) {
      await validateItemReferences({
        categoryId: data.categoryId!,
        allowedUnitIds: data.allowedUnitIds || [],
      });
    }

    const item = await updateItemDAL(itemId, data);

    // Revalidate cache
    await revalidateItemCache();

    return {
      success: true,
      item,
      message: "Item updated successfully!",
    };
  }
);

export const deleteItem = withPermission(
  Permission.CREATE_ITEMS,
  async (_user, itemId: string) => {
    const deletedItem = await deleteItemDAL(itemId);

    // Revalidate cache
    await revalidateItemCache();

    return {
      success: true,
      item: deletedItem,
      message: "Item deleted successfully!",
    };
  }
);
