"use server";

import {
  getRecipes as getRecipesFromDAL,
  getRecipeTimeRange as getRecipeTimeRangeFromDAL,
  getRecipeCategories as getRecipeCategoriesFromDAL,
  getRecipeCount as getRecipeCountFromDAL,
  getRandomRecipes as getRandomRecipesFromDAL,
} from "@/data/recipes/getRecipes";
import { getRecipeById as getRecipeByIdFromDAL } from "@/data/recipes/getRecipeById";
import { RecipeFilters } from "@/data/types";
import { createPublicAction } from "@/lib/action-helpers";

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
