import { prisma } from "@/lib/prisma";
import type { Recipe, RecipeCategory, Prisma } from "@prisma/client";

export interface RecipeFilters {
  query?: string;
  categoryIds?: string[];
  categoryMode?: "include" | "exclude";
  ingredientIds?: string[];
  approved?: boolean;
  minTime?: number;
  maxTime?: number;
}

export interface GetRecipesDALParams {
  page?: number;
  pageSize?: number;
  filters?: RecipeFilters;
}

export type RecipeWithCategories = Recipe & { categories: RecipeCategory[] };

function buildWhereClause(
  filters: RecipeFilters = {}
): Prisma.RecipeWhereInput {
  const where: Prisma.RecipeWhereInput = {};

  if (filters.query) {
    where.name = { contains: filters.query, mode: "insensitive" };
  }

  const categoryIds = Array.isArray(filters.categoryIds)
    ? filters.categoryIds
    : [];
  if (categoryIds.length > 0) {
    const categoryMode = filters.categoryMode || "include";

    if (categoryMode === "include") {
      where.categoryIds = { hasEvery: categoryIds };
    } else {
      // exclude mode - recipes that don't have any of these categories
      where.NOT = {
        categoryIds: { hasSome: categoryIds },
      };
    }
  }

  const ingredientIds = Array.isArray(filters.ingredientIds)
    ? filters.ingredientIds
    : [];
  if (ingredientIds.length > 0) {
    where.ingredients = {
      some: {
        itemId: { in: ingredientIds },
      },
    };
  }

  // if (typeof filters.approved === "boolean") {
  //   where.approved = filters.approved;
  // }

  // Temp: only show approved recipes for now
  where.approved = true;

  if (
    typeof filters.minTime === "number" ||
    typeof filters.maxTime === "number"
  ) {
    where.timeInMinutes = {};
    if (typeof filters.minTime === "number") {
      where.timeInMinutes.gte = filters.minTime;
    }
    if (typeof filters.maxTime === "number") {
      where.timeInMinutes.lte = filters.maxTime;
    }
  }

  return where;
}

export async function getRecipes({
  page = 1,
  pageSize = 10,
  filters = {},
}: GetRecipesDALParams = {}) {
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  const where = buildWhereClause(filters);

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

export async function getRecipeTimeRange() {
  const result = await prisma.recipe.aggregate({
    _min: {
      timeInMinutes: true,
    },
    _max: {
      timeInMinutes: true,
    },
    where: {
      approved: true,
    },
  });

  return {
    min: result._min.timeInMinutes || 0,
    max: result._max.timeInMinutes || 120,
  };
}

export async function getRecipeCategories() {
  const categories = await prisma.recipeCategory.findMany({
    orderBy: { name: "asc" },
  });

  return categories;
}

export async function getRecipeIngredients() {
  const items = await prisma.item.findMany({
    orderBy: { name: "asc" },
  });

  return items;
}
