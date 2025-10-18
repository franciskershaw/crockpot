import { Recipe, RecipeRelevance, RecipeFilters } from "@/data/types";
import type { Prisma } from "@prisma/client";

// Calculate the maximum possible relevance score for given filters
export function calculateMaxPossibleScore(
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
  if (
    (filters.minTime !== undefined && filters.minTime !== timeRange.min) ||
    (filters.maxTime !== undefined && filters.maxTime !== timeRange.max)
  ) {
    maxScore += 5;
  }

  // Max score from query match
  if (filters.query && filters.query.trim() !== "") {
    maxScore += 20;
  }

  return maxScore;
}

// Calculate relevance score for a recipe based on applied filters
export function calculateRelevance(
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
export function hasActiveFilters(
  filters: RecipeFilters,
  timeRange: { min: number; max: number }
): boolean {
  const hasQuery = filters.query && filters.query.trim() !== "";
  const hasCategories = filters.categoryIds && filters.categoryIds.length > 0;
  const hasIngredients =
    filters.ingredientIds && filters.ingredientIds.length > 0;

  // Only consider time range as active if explicitly set (not undefined)
  const hasTimeRange =
    (filters.minTime !== undefined && filters.minTime !== timeRange.min) ||
    (filters.maxTime !== undefined && filters.maxTime !== timeRange.max);

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

export function buildWhereClause(
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
