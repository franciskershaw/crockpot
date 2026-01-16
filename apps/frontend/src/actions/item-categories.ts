"use server";

import {
  createPublicAction,
  Permission,
  withPermission,
  withPermissionAndValidation,
  revalidateItemCache,
} from "@/lib/action-helpers";
import { getItemCategoriesWithUsage as getItemCategoriesWithUsageFromDAL } from "@/data/item-categories/getItemCategoriesWithUsage";
import { createItemCategory as createItemCategoryDAL } from "@/data/item-categories/createItemCategory";
import { updateItemCategory as updateItemCategoryDAL } from "@/data/item-categories/updateItemCategory";
import { deleteItemCategory as deleteItemCategoryDAL } from "@/data/item-categories/deleteItemCategory";
import { getItemCategoryUsageCount } from "@/data/item-categories/getItemCategoryUsageCount";
import { createItemCategorySchema } from "@/lib/validations";
import { ValidationError } from "@/lib/errors";

export const getItemCategoriesWithUsage = createPublicAction(async () => {
  return await getItemCategoriesWithUsageFromDAL();
});

export const createItemCategory = withPermissionAndValidation(
  Permission.CREATE_ITEMS,
  createItemCategorySchema,
  async (validated) => {
    const itemCategory = await createItemCategoryDAL(validated);

    await revalidateItemCache({
      includeTags: ["item-categories"],
      includePaths: ["/admin/item-categories", "/admin/items"],
    });

    return {
      success: true,
      itemCategory,
      message: "Item category created successfully!",
    };
  }
);

export const updateItemCategory = withPermission(
  Permission.CREATE_ITEMS,
  async (_user, data: { name?: string; faIcon?: string }, id: string) => {
    const itemCategory = await updateItemCategoryDAL(id, data);

    await revalidateItemCache({
      includeTags: ["item-categories"],
      includePaths: ["/admin/item-categories", "/admin/items"],
    });

    return {
      success: true,
      itemCategory,
      message: "Item category updated successfully!",
    };
  }
);

export const deleteItemCategory = withPermission(
  Permission.CREATE_ITEMS,
  async (_user, id: string) => {
    // Block delete if in use by any item
    const inUse = await getItemCategoryUsageCount(id);
    if (inUse > 0) {
      throw new ValidationError(
        "This item category is used by one or more items. Remove it from those items first."
      );
    }

    const itemCategory = await deleteItemCategoryDAL(id);

    await revalidateItemCache({
      includeTags: ["item-categories"],
      includePaths: ["/admin/item-categories", "/admin/items"],
    });

    return {
      success: true,
      itemCategory,
      message: "Item category deleted successfully!",
    };
  }
);
