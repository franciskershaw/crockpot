"use server";

import {
  getRecipes as getRecipesFromDAL,
  getRecipeTimeRange as getRecipeTimeRangeFromDAL,
  getRecipeCategories as getRecipeCategoriesFromDAL,
  getRecipeIngredients as getRecipeIngredientsFromDAL,
  getRecipeCount as getRecipeCountFromDAL,
  getRandomRecipes as getRandomRecipesFromDAL,
} from "@/data/recipes/getRecipes";
import { getRecipeById as getRecipeByIdFromDAL } from "@/data/recipes/getRecipeById";
import { RecipeFilters } from "@/data/types";

export interface GetRecipesParams {
  page?: number;
  pageSize?: number;
  filters?: RecipeFilters;
}

export async function getRecipes({
  page = 1,
  pageSize = 10,
  filters = {},
}: GetRecipesParams = {}) {
  return await getRecipesFromDAL({
    page,
    pageSize,
    filters,
  });
}

export async function getRecipeTimeRange() {
  return await getRecipeTimeRangeFromDAL();
}

export async function getRecipeCategories() {
  return await getRecipeCategoriesFromDAL();
}

export async function getRecipeIngredients() {
  return await getRecipeIngredientsFromDAL();
}

export async function getRecipeCount(filters: RecipeFilters = {}) {
  return await getRecipeCountFromDAL(filters);
}

export async function getRandomRecipes(count: number = 12) {
  return await getRandomRecipesFromDAL(count);
}

export async function getRecipeById(id: string) {
  return await getRecipeByIdFromDAL(id);
}
