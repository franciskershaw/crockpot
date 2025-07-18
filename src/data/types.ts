import {
  Recipe as PrismaRecipe,
  RecipeCategory as PrismaRecipeCategory,
} from "@prisma/client";

export type Recipe = PrismaRecipe & { categories: RecipeCategory[] };
export type RecipeCategory = PrismaRecipeCategory;
