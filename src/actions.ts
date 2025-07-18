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
