import { prisma } from "@/lib/prisma";
import { GetRecipesDALParams, Recipe, RecipeFilters } from "../types";
import {
  buildWhereClause,
  calculateRelevance,
  hasActiveFilters,
} from "./helper";

export async function getRecipes({
  page = 1,
  pageSize = 10,
  filters = {},
}: GetRecipesDALParams = {}) {
  const where = buildWhereClause(filters);
  const timeRange = await getRecipeTimeRange();
  const isFiltered = hasActiveFilters(filters, timeRange);

  if (!isFiltered) {
    // No filters active - use normal pagination with default sorting
    const skip = (page - 1) * pageSize;
    const take = pageSize;

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

  // Filters are active - get ALL results, calculate relevance, sort by relevance, then paginate
  const [allRecipes, total] = await Promise.all([
    prisma.recipe.findMany({
      where,
      include: { categories: true },
      // No skip/take - get everything that matches the filters
    }),
    prisma.recipe.count({ where }),
  ]);

  // First pass: calculate relevance scores to find the highest score
  const recipesWithTempRelevance = allRecipes.map((recipe) => {
    const relevance = calculateRelevance(recipe, filters, timeRange);
    return { recipe, relevance };
  });

  // Find the highest score among all results
  const highestScore = Math.max(
    ...recipesWithTempRelevance.map((r) => r.relevance.score)
  );

  // Second pass: calculate final relevance with highest score information
  const recipesWithRelevance: Recipe[] = recipesWithTempRelevance.map(
    ({ recipe }) => {
      const relevance = calculateRelevance(
        recipe,
        filters,
        timeRange,
        highestScore
      );
      return { ...recipe, relevance };
    }
  );

  // Sort all recipes by relevance (highest score first)
  recipesWithRelevance.sort((a, b) => {
    const scoreA = a.relevance?.score || 0;
    const scoreB = b.relevance?.score || 0;
    // Primary sort by relevance score (descending)
    if (scoreA !== scoreB) {
      return scoreB - scoreA;
    }
    // Secondary sort by creation date (descending) for recipes with same score
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Apply pagination to the sorted results
  const skip = (page - 1) * pageSize;
  const paginatedRecipes = recipesWithRelevance.slice(skip, skip + pageSize);

  return {
    recipes: paginatedRecipes,
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

export async function getRecipeCount(filters: RecipeFilters = {}) {
  const where = buildWhereClause(filters);
  return await prisma.recipe.count({ where });
}

export async function getRandomRecipes(count: number = 12) {
  // Get random approved recipes for background display
  const recipes = await prisma.recipe.findMany({
    where: {
      approved: true,
    },
    include: { categories: true },
    take: count,
    orderBy: {
      createdAt: "desc", // For now, just get recent ones - in future could use random ordering
    },
  });

  return recipes;
}
