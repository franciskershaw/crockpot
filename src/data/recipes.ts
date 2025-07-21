import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import type { RecipeRelevance, Recipe } from "@/data/types";

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

// Calculate the maximum possible relevance score for given filters
function calculateMaxPossibleScore(
  filters: RecipeFilters,
  timeRange: { min: number; max: number }
): number {
  let maxScore = 0;

  // Max score from ingredients
  const filterIngredients = filters.ingredientIds || [];
  maxScore += filterIngredients.length * 10;

  // Max score from categories
  const filterCategories = filters.categoryIds || [];
  maxScore += filterCategories.length * 15;

  // Max score from time range (if filter is applied)
  if (filters.minTime !== timeRange.min || filters.maxTime !== timeRange.max) {
    maxScore += 5;
  }

  // Max score from query match
  if (filters.query && filters.query.trim() !== "") {
    maxScore += 20;
  }

  return maxScore;
}

// Calculate relevance score for a recipe based on applied filters
function calculateRelevance(
  recipe: Recipe,
  filters: RecipeFilters,
  timeRange: { min: number; max: number },
  highestScoreInResults: number = 0
): RecipeRelevance {
  let score = 0;
  let matchedIngredients = 0;
  let matchedCategories = 0;
  let hasTimeMatch = true;
  let hasQueryMatch = true;

  // Calculate max possible score for these filters
  const maxPossibleScore = calculateMaxPossibleScore(filters, timeRange);
  const contentFiltersApplied = hasContentFilters(filters);

  // Check ingredient matches
  const filterIngredients = filters.ingredientIds || [];
  if (filterIngredients.length > 0) {
    const recipeIngredientIds = recipe.ingredients.map((ing) => ing.itemId);
    matchedIngredients = filterIngredients.filter((id) =>
      recipeIngredientIds.includes(id)
    ).length;
    score += matchedIngredients * 10; // 10 points per matching ingredient
  }

  // Check category matches
  const filterCategories = filters.categoryIds || [];
  if (filterCategories.length > 0) {
    const recipeCategoryIds = recipe.categoryIds;
    matchedCategories = filterCategories.filter((id) =>
      recipeCategoryIds.includes(id)
    ).length;
    score += matchedCategories * 15; // 15 points per matching category (higher weight)
  }

  // Check time range match
  if (filters.minTime !== undefined || filters.maxTime !== undefined) {
    const minTime = filters.minTime ?? timeRange.min;
    const maxTime = filters.maxTime ?? timeRange.max;
    hasTimeMatch =
      recipe.timeInMinutes >= minTime && recipe.timeInMinutes <= maxTime;
    if (
      hasTimeMatch &&
      (filters.minTime !== timeRange.min || filters.maxTime !== timeRange.max)
    ) {
      score += 5; // 5 points for time match when time filter is applied
    }
  }

  // Check query match
  if (filters.query && filters.query.trim() !== "") {
    hasQueryMatch = recipe.name
      .toLowerCase()
      .includes(filters.query.toLowerCase());
    if (hasQueryMatch) {
      score += 20; // 20 points for name match
    }
  }

  return {
    score,
    maxPossibleScore,
    highestScoreInResults,
    hasContentFilters: contentFiltersApplied,
    matchedIngredients,
    matchedCategories,
    hasTimeMatch,
    hasQueryMatch,
  };
}

// Check if any meaningful filters are applied (excluding defaults)
function hasActiveFilters(
  filters: RecipeFilters,
  timeRange: { min: number; max: number }
): boolean {
  const hasQuery = filters.query && filters.query.trim() !== "";
  const hasCategories = filters.categoryIds && filters.categoryIds.length > 0;
  const hasIngredients =
    filters.ingredientIds && filters.ingredientIds.length > 0;
  const hasTimeRange =
    filters.minTime !== timeRange.min || filters.maxTime !== timeRange.max;

  return hasQuery || hasCategories || hasIngredients || hasTimeRange;
}

// Check if meaningful content filters are applied (excludes time-only filtering)
function hasContentFilters(filters: RecipeFilters): boolean {
  const hasQuery = !!(filters.query && filters.query.trim() !== "");
  const hasCategories = !!(
    filters.categoryIds && filters.categoryIds.length > 0
  );
  const hasIngredients = !!(
    filters.ingredientIds && filters.ingredientIds.length > 0
  );

  return hasQuery || hasCategories || hasIngredients;
}

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
  const ingredientIds = Array.isArray(filters.ingredientIds)
    ? filters.ingredientIds
    : [];

  // Build OR conditions for categories and ingredients
  const orConditions: Prisma.RecipeWhereInput[] = [];

  if (categoryIds.length > 0) {
    const categoryMode = filters.categoryMode || "include";

    if (categoryMode === "include") {
      orConditions.push({
        categoryIds: { hasSome: categoryIds },
      });
    } else {
      // exclude mode - recipes that don't have any of these categories
      where.NOT = {
        categoryIds: { hasSome: categoryIds },
      };
    }
  }

  if (ingredientIds.length > 0) {
    orConditions.push({
      ingredients: {
        some: {
          itemId: { in: ingredientIds },
        },
      },
    });
  }

  // Apply OR logic between categories and ingredients
  if (orConditions.length > 0) {
    where.OR = orConditions;
  }

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
