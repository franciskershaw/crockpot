"use server";

import { createPublicAction, Permission, withPermission, withPermissionAndValidation, revalidateRecipeCache } from "@/lib/action-helpers";
import { getRecipeCategoriesWithUsage as getRecipeCategoriesWithUsageFromDAL } from "@/data/recipe-categories/getRecipeCategoriesWithUsage";
import { createRecipeCategory as createRecipeCategoryDAL } from "@/data/recipe-categories/createRecipeCategory";
import { updateRecipeCategory as updateRecipeCategoryDAL } from "@/data/recipe-categories/updateRecipeCategory";
import { deleteRecipeCategory as deleteRecipeCategoryDAL } from "@/data/recipe-categories/deleteRecipeCategory";
import { getRecipeCategoryUsageCount } from "@/data/recipe-categories/getRecipeCategoryUsageCount";
import { z } from "zod";
import { ValidationError } from "@/lib/errors";

const createRecipeCategorySchema = z.object({
  name: z.string().min(2).max(50),
});

export const getRecipeCategoriesWithUsage = createPublicAction(async () => {
  return await getRecipeCategoriesWithUsageFromDAL();
});

export const createRecipeCategory = withPermissionAndValidation(
  Permission.APPROVE_CONTENT,
  createRecipeCategorySchema,
  async (validated) => {
    const recipeCategory = await createRecipeCategoryDAL(validated);

    await revalidateRecipeCache({ includeTags: ["categories"], includePaths: ["/admin/recipe-categories", "/recipes"] });

    return { success: true, recipeCategory, message: "Recipe category created successfully!" };
  }
);

export const updateRecipeCategory = withPermission(
  Permission.APPROVE_CONTENT,
  async (_user, data: { name?: string }, id: string) => {
    const recipeCategory = await updateRecipeCategoryDAL(id, data);

    await revalidateRecipeCache({ includeTags: ["categories"], includePaths: ["/admin/recipe-categories", "/recipes"] });

    return { success: true, recipeCategory, message: "Recipe category updated successfully!" };
  }
);

export const deleteRecipeCategory = withPermission(
  Permission.APPROVE_CONTENT,
  async (_user, id: string) => {
    // Block delete if in use by any recipe
    const inUse = await getRecipeCategoryUsageCount(id);
    if (inUse > 0) {
      throw new ValidationError(
        "This recipe category is used by one or more recipes. Remove it from those recipes first."
      );
    }

    const recipeCategory = await deleteRecipeCategoryDAL(id);

    await revalidateRecipeCache({ includeTags: ["categories", "recipes"], includePaths: ["/admin/recipe-categories", "/recipes"] });

    return { success: true, recipeCategory, message: "Recipe category deleted successfully!" };
  }
);


