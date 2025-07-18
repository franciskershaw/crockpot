"use server";

import { signIn, signOut } from "@/auth";

export async function signInWithGoogle() {
  await signIn("google");
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

import {
  getRecipes as getRecipesFromDAL,
  getRecipeTimeRange as getRecipeTimeRangeFromDAL,
  getRecipeCategories as getRecipeCategoriesFromDAL,
  getRecipeIngredients as getRecipeIngredientsFromDAL,
  type RecipeFilters,
} from "@/data/recipes";

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
