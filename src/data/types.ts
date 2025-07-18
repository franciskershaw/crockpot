import { Recipe as PrismaRecipe, RecipeCategory } from "@prisma/client";

export type Recipe = PrismaRecipe & { categories: RecipeCategory[] };
