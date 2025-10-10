/**
 * Relevance-based recipe filtering with caching optimization
 *
 * This solves the performance issue while maintaining:
 * 1. Exact relevance-based ordering
 * 2. Accurate badge calculations (best match/good match)
 * 3. Infinite scroll compatibility
 * 4. Global highest score awareness for badge thresholds
 */

import { prisma } from "@/lib/prisma";
import { RecipeFilters } from "@/data/types";
import { buildWhereClause } from "./helper";
import { tags } from "@/lib/constants";

/**
 * Cached relevance data for a recipe
 */
interface CachedRecipeRelevance {
  id: string;
  score: number;
  matchedIngredients: number;
  matchedCategories: number;
  hasTimeMatch: boolean;
  hasQueryMatch: boolean;
}

/**
 * Cached relevance index for a filter combination
 */
interface RelevanceIndex {
  recipeRelevances: CachedRecipeRelevance[];
  highestScore: number;
  maxPossibleScore: number;
  hasContentFilters: boolean;
  total: number;
}

/**
 * Generate cache key for filter combination
 */
function getRelevanceCacheKey(filters: RecipeFilters): string {
  const normalizedFilters = {
    query: filters.query?.trim() || "",
    categoryIds: (filters.categoryIds || []).sort(),
    categoryMode: filters.categoryMode || "include",
    ingredientIds: (filters.ingredientIds || []).sort(),
    minTime: filters.minTime,
    maxTime: filters.maxTime,
  };

  return `relevance-index:${JSON.stringify(normalizedFilters)}`;
}

/**
 * Build and cache the relevance index for filtered recipes
 * This calculates relevance for all matching recipes once and caches the sorted order
 */
async function buildRelevanceIndex(
  filters: RecipeFilters,
  timeRange: { min: number; max: number }
): Promise<RelevanceIndex> {
  const { unstable_cache } = await import("next/cache");

  const getCachedIndex = unstable_cache(
    async (): Promise<RelevanceIndex> => {
      const where = buildWhereClause(filters);

      // Get all matching recipes with minimal data needed for relevance calculation
      const [allRecipes, total] = await Promise.all([
        prisma.recipe.findMany({
          where,
          select: {
            id: true,
            name: true,
            timeInMinutes: true,
            categoryIds: true,
            createdAt: true,
            ingredients: {
              select: {
                itemId: true,
              },
            },
          },
        }),
        prisma.recipe.count({ where }),
      ]);

      // Calculate relevance for all recipes using lightweight calculation
      const recipesWithRelevance = allRecipes.map((recipe) => {
        const relevance = calculateLightweightRelevance(
          recipe,
          filters,
          timeRange
        );
        return {
          id: recipe.id,
          score: relevance.score,
          matchedIngredients: relevance.matchedIngredients,
          matchedCategories: relevance.matchedCategories,
          hasTimeMatch: relevance.hasTimeMatch,
          hasQueryMatch: relevance.hasQueryMatch,
          createdAt: recipe.createdAt,
        };
      });

      // Find highest score
      const highestScore = Math.max(
        ...recipesWithRelevance.map((r) => r.score),
        0
      );

      // Sort by relevance score, then by creation date
      recipesWithRelevance.sort((a, b) => {
        if (a.score !== b.score) {
          return b.score - a.score; // Higher scores first
        }
        // Secondary sort by creation date
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });

      // Create the cached index
      const index: RelevanceIndex = {
        recipeRelevances: recipesWithRelevance.map((r) => ({
          id: r.id,
          score: r.score,
          matchedIngredients: r.matchedIngredients,
          matchedCategories: r.matchedCategories,
          hasTimeMatch: r.hasTimeMatch,
          hasQueryMatch: r.hasQueryMatch,
        })),
        highestScore,
        maxPossibleScore: calculateMaxPossibleScore(filters, timeRange),
        hasContentFilters: hasContentFilters(filters),
        total,
      };

      return index;
    },
    [getRelevanceCacheKey(filters)],
    {
      revalidate: 300, // Cache for 5 minutes
      tags: [tags.RECIPES, tags.RELEVANCE, tags.FILTERED],
    }
  );

  return getCachedIndex();
}

/**
 * Get paginated recipes using cached relevance index
 */
export async function getRecipesWithCachedRelevance({
  page = 1,
  pageSize = 10,
  filters = {},
  timeRange,
}: {
  page?: number;
  pageSize?: number;
  filters?: RecipeFilters;
  timeRange: { min: number; max: number };
}) {
  // Get the cached relevance index
  const index = await buildRelevanceIndex(filters, timeRange);

  // Calculate pagination
  const skip = (page - 1) * pageSize;
  const paginatedRelevances = index.recipeRelevances.slice(
    skip,
    skip + pageSize
  );

  if (paginatedRelevances.length === 0) {
    return {
      recipes: [],
      total: index.total,
      page,
      pageSize,
      totalPages: Math.ceil(index.total / pageSize),
    };
  }

  // Fetch only the recipes we need for this page
  const recipeIds = paginatedRelevances.map((r) => r.id);
  const recipes = await prisma.recipe.findMany({
    where: {
      id: { in: recipeIds },
    },
    include: {
      categories: true,
    },
  });

  // Create a map for O(1) lookup
  const recipesMap = new Map(recipes.map((recipe) => [recipe.id, recipe]));

  // Build ordered recipes with full relevance data
  const orderedRecipes = paginatedRelevances
    .map((cached) => {
      const recipe = recipesMap.get(cached.id);
      if (!recipe) return null;

      // Reconstruct full relevance object with cached highest score
      return {
        ...recipe,
        relevance: {
          score: cached.score,
          maxPossibleScore: index.maxPossibleScore,
          highestScoreInResults: index.highestScore,
          hasContentFilters: index.hasContentFilters,
          matchedIngredients: cached.matchedIngredients,
          matchedCategories: cached.matchedCategories,
          hasTimeMatch: cached.hasTimeMatch,
          hasQueryMatch: cached.hasQueryMatch,
        },
      };
    })
    .filter((recipe): recipe is NonNullable<typeof recipe> => recipe !== null);

  return {
    recipes: orderedRecipes,
    total: index.total,
    page,
    pageSize,
    totalPages: Math.ceil(index.total / pageSize),
  };
}

/**
 * Lightweight relevance calculation for minimal recipe data
 * This matches the algorithm in helper.ts but works with select-only recipe data
 */
function calculateLightweightRelevance(
  recipe: {
    id: string;
    name: string;
    timeInMinutes: number;
    categoryIds: string[];
    ingredients: { itemId: string }[];
  },
  filters: RecipeFilters,
  timeRange: { min: number; max: number }
) {
  let score = 0;
  let matchedIngredients = 0;
  let matchedCategories = 0;
  let hasTimeMatch = true;
  let hasQueryMatch = true;

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
    score += matchedCategories * 15; // 15 points per matching category
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
    matchedIngredients,
    matchedCategories,
    hasTimeMatch,
    hasQueryMatch,
  };
}

// Helper functions that need to be imported
function calculateMaxPossibleScore(
  filters: RecipeFilters,
  timeRange: { min: number; max: number }
): number {
  let maxScore = 0;

  const filterIngredients = filters.ingredientIds || [];
  maxScore += filterIngredients.length * 10;

  const filterCategories = filters.categoryIds || [];
  maxScore += filterCategories.length * 15;

  if (filters.minTime !== timeRange.min || filters.maxTime !== timeRange.max) {
    maxScore += 5;
  }

  if (filters.query && filters.query.trim() !== "") {
    maxScore += 20;
  }

  return maxScore;
}

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
