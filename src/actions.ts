"use server";

import { signIn, signOut } from "@/auth";

export async function signInWithGoogle() {
  await signIn("google");
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

import { getRecipes as getRecipesFromDAL } from "@/data/recipes";

export interface GetRecipesParams {
  page?: number;
  pageSize?: number;
  query?: string;
  categoryIds?: string[];
  approved?: boolean;
}

export async function getRecipes(params: GetRecipesParams = {}) {
  return getRecipesFromDAL(params);
}
