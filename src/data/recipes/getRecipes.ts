import { prisma } from "@/lib/prisma";
import { GetRecipesDALParams, RecipeFilters } from "@/data/types";
import { buildWhereClause, hasActiveFilters } from "./helper";
import {
  recipeCategoriesInclude,
  recentFirstOrderBy,
} from "@/data/fragments/query-fragments";
import { tags } from "@/lib/constants";

export async function getRecipes({
  page = 1,
  pageSize = 10,
  filters = {},
}: GetRecipesDALParams = {}) {
  const where = buildWhereClause(filters);
  const timeRange = await getRecipeTimeRange();
  const isFiltered = hasActiveFilters(filters, timeRange);

  if (!isFiltered) {
    const { unstable_cache } = await import("next/cache");

    const cacheKey = `unfiltered-recipes-${page}-${pageSize}`;

    const getCachedUnfilteredRecipes = unstable_cache(
      async () => {
        const skip = (page - 1) * pageSize;
        const take = pageSize;

        const [recipes, total] = await Promise.all([
          prisma.recipe.findMany({
            where,
            skip,
            take,
            orderBy: recentFirstOrderBy,
            include: recipeCategoriesInclude,
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
      },
      [cacheKey],
      {
        revalidate: 300,
        tags: [tags.RECIPES],
      }
    );

    const result = await getCachedUnfilteredRecipes();
    return result;
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

export async function getRandomRecipes(count: number = 12) {
  // Get random approved recipes for background display
  const recipes = await prisma.recipe.findMany({
    where: {
      approved: true,
    },
    include: recipeCategoriesInclude,
    take: count,
    orderBy: recentFirstOrderBy,
  });

  return recipes;
}
