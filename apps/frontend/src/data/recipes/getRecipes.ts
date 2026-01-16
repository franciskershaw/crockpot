import { prisma } from "@/lib/prisma";
import { GetRecipesDALParams, RecipeFilters } from "@/data/types";
import { buildWhereClause, hasActiveFilters } from "./helper";
import { recipeCategoriesInclude } from "@/data/fragments/query-fragments";
import { tags } from "@/lib/constants";

// Simple hash function for deterministic shuffling
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

export async function getRecipes({
  page = 1,
  pageSize = 10,
  filters = {},
  seed,
}: GetRecipesDALParams & { seed?: number } = {}) {
  const where = buildWhereClause(filters);
  const timeRange = await getRecipeTimeRange();
  const isFiltered = hasActiveFilters(filters, timeRange);

  if (!isFiltered) {
    // If no seed provided, generate a random one (different every request)
    const sortSeed = seed ?? Math.random();

    // Fetch all recipes (only ~189, so this is fine)
    const allRecipes = await prisma.recipe.findMany({
      where,
      include: recipeCategoriesInclude,
    });

    // Shuffle using the seed
    const shuffled = allRecipes
      .map((recipe) => ({
        recipe,
        sort: hashString(recipe.id + sortSeed.toString()),
      }))
      .sort((a, b) => a.sort - b.sort)
      .map((item) => item.recipe);

    // Paginate the shuffled results
    const skip = (page - 1) * pageSize;

    const recipes = shuffled.slice(skip, skip + pageSize);
    const total = shuffled.length;

    return {
      recipes,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  // Filters are active - use optimized cached relevance approach
  const { getRecipesWithCachedRelevance } = await import("./relevance-cache");
  const result = await getRecipesWithCachedRelevance({
    page,
    pageSize,
    filters,
    timeRange,
  });

  return result;
}

export async function getRecipeTimeRange() {
  const { unstable_cache } = await import("next/cache");

  const getCachedTimeRange = unstable_cache(
    async () => {
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
    },
    [tags.RECIPE_TIME_RANGE],
    {
      revalidate: 3600, // Cache for 1 hour
      tags: [tags.RECIPES, tags.TIME_RANGE],
    }
  );

  return getCachedTimeRange();
}

export async function getRecipeCategories() {
  const { unstable_cache } = await import("next/cache");

  const getCachedCategories = unstable_cache(
    async () => {
      const categories = await prisma.recipeCategory.findMany({
        orderBy: { name: "asc" },
      });
      return categories;
    },
    [tags.RECIPE_CATEGORIES],
    {
      revalidate: 3600, // Cache for 1 hour
      tags: [tags.RECIPES, tags.CATEGORIES],
    }
  );

  return getCachedCategories();
}

export async function getRecipeCount(filters: RecipeFilters = {}) {
  const { unstable_cache } = await import("next/cache");

  const getCachedCount = unstable_cache(
    async () => {
      const where = buildWhereClause(filters);
      return await prisma.recipe.count({ where });
    },
    [`recipe-count-${JSON.stringify(filters)}`],
    {
      revalidate: 300, // 5 minutes
      tags: [tags.RECIPES], // Ensure count updates when recipes change
    }
  );

  return getCachedCount();
}
