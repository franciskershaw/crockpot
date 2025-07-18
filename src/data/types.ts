import {
  Recipe as PrismaRecipe,
  RecipeCategory as PrismaRecipeCategory,
  Item as PrismaItem,
} from "@prisma/client";

export type Recipe = PrismaRecipe & { categories: RecipeCategory[] };
export type RecipeCategory = PrismaRecipeCategory;
export type Item = PrismaItem;
