"use server";

import {
  getRecipes as getRecipesFromDAL,
  getRecipeTimeRange as getRecipeTimeRangeFromDAL,
  getRecipeCategories as getRecipeCategoriesFromDAL,
  getRecipeCount as getRecipeCountFromDAL,
  getRandomRecipes as getRandomRecipesFromDAL,
} from "@/data/recipes/getRecipes";
import { getRecipeById as getRecipeByIdFromDAL } from "@/data/recipes/getRecipeById";
import { createRecipe as createRecipeDAL } from "@/data/recipes/createRecipe";
import { RecipeFilters } from "@/data/types";
import {
  createPublicAction,
  withPermissionAndValidation,
  Permission,
} from "@/lib/action-helpers";
import { createRecipeSchema } from "@/lib/validations";
import { validateRecipeReferences } from "@/lib/security";
import { revalidatePath } from "next/cache";

export interface GetRecipesParams {
  page?: number;
  pageSize?: number;
  filters?: RecipeFilters;
}

export const getRecipes = createPublicAction(
  async ({ page = 1, pageSize = 10, filters = {} }: GetRecipesParams = {}) => {
    return await getRecipesFromDAL({
      page,
      pageSize,
      filters,
    });
  }
);

export const getRecipeTimeRange = createPublicAction(async () => {
  return await getRecipeTimeRangeFromDAL();
});

export const getRecipeCategories = createPublicAction(async () => {
  return await getRecipeCategoriesFromDAL();
});

export const getRecipeCount = createPublicAction(
  async (filters: RecipeFilters = {}) => {
    return await getRecipeCountFromDAL(filters);
  }
);

export const getRandomRecipes = createPublicAction(
  async (count: number = 12) => {
    return await getRandomRecipesFromDAL(count);
  }
);

export const getRecipeById = createPublicAction(async (id: string) => {
  return await getRecipeByIdFromDAL(id);
});

export const createRecipe = withPermissionAndValidation(
  Permission.CREATE_RECIPES,
  createRecipeSchema,
  async (validatedInput, user) => {
    // Validate all referenced database entities exist
    await validateRecipeReferences(validatedInput);

    // Create the recipe
    const recipe = await createRecipeDAL(user.id, validatedInput);

    // Revalidate relevant paths
    revalidatePath("/recipes");
    revalidatePath("/your-crockpot");

    return {
      success: true,
      recipe,
      message: "Recipe created successfully and is pending approval",
    };
  }
);
