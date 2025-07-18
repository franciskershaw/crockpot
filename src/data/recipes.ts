import { prisma } from "@/lib/prisma";
import type { Recipe, RecipeCategory, Prisma } from "@prisma/client";

export interface GetRecipesDALParams {
  page?: number;
  pageSize?: number;
  query?: string;
  categoryIds?: string[];
  approved?: boolean;
}

export type RecipeWithCategories = Recipe & { categories: RecipeCategory[] };

export async function getRecipes({
  page = 1,
  pageSize = 10,
  query,
  categoryIds,
  approved,
}: GetRecipesDALParams = {}) {
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  const where: Prisma.RecipeWhereInput = {};

  if (query) {
    where.name = { contains: query, mode: "insensitive" };
  }
  if (categoryIds && categoryIds.length > 0) {
    where.categoryIds = { hasSome: categoryIds };
  }
  if (typeof approved === "boolean") {
    where.approved = approved;
  }

  const [recipes, total] = await Promise.all([
    prisma.recipe.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: "desc" },
      include: { categories: true },
    }),
    prisma.recipe.count({ where }),
  ]);

  return {
    recipes,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}
