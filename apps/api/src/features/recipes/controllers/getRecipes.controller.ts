import { Context } from "hono";

import type { PipelineStage } from "mongoose";

import {
  buildMatchFilter,
  buildRecipesPipeline,
  hasRelevanceFilters,
  MAX_SEED_RESULTS,
  seededSortKey,
} from "../helpers/getRecipes.helper";
import Recipe from "../model/recipe.model";
import type { GetRecipesQuery } from "../validation/getRecipes.recipe.validation";

const getRecipes = async (c: Context) => {
  const query = (c.req as { valid: (key: "query") => GetRecipesQuery }).valid(
    "query"
  );
  const page = query.page ?? 1;
  const pageSize = query.pageSize ?? 10;
  const skip = (page - 1) * pageSize;
  const seedInMemory = query.seed != null;

  const matchFilter = buildMatchFilter(query);
  const recipesPipeline = buildRecipesPipeline(
    query,
    skip,
    pageSize,
    seedInMemory
  );

  const [result] = await Recipe.aggregate([
    { $match: matchFilter },
    {
      $facet: {
        recipes: recipesPipeline as PipelineStage.FacetPipelineStage[],
        total: [{ $count: "count" }],
      },
    },
  ]);

  let recipes = result.recipes ?? [];
  const total = result.total?.[0]?.count ?? 0;

  if (seedInMemory && query.seed != null && recipes.length > 0) {
    if (hasRelevanceFilters(query)) {
      // Keep pipeline order (relevance); just paginate
      recipes = recipes.slice(skip, skip + pageSize);
    } else {
      const seed = query.seed;
      recipes = [...recipes]
        .sort(
          (a, b) =>
            seededSortKey(String(a._id), seed) -
            seededSortKey(String(b._id), seed)
        )
        .slice(skip, skip + pageSize);
    }
  }

  // Attach relevance for badges when filters were applied
  const hasRelevance = recipes.length > 0 && recipes[0]._relevanceScore != null;
  if (hasRelevance) {
    const highestScoreInResults = Math.max(
      ...recipes.map(
        (r: { _relevanceScore?: number }) => r._relevanceScore ?? 0
      )
    );
    const hasContentFilters =
      !!query.query?.trim() ||
      !!query.categoryIds?.length ||
      !!query.ingredientIds?.length;
    const maxPossibleScore =
      (query.query?.trim() ? 20 : 0) +
      (query.categoryIds?.length ?? 0) * 15 +
      (query.ingredientIds?.length ?? 0) * 10 +
      (query.minTime != null || query.maxTime != null ? 5 : 0);

    recipes = recipes.map(
      (r: {
        _relevanceScore?: number;
        _matchedCategories?: number;
        _matchedIngredients?: number;
        [k: string]: unknown;
      }) => {
        const {
          _relevanceScore,
          _matchedCategories,
          _matchedIngredients,
          ...rest
        } = r;
        return {
          ...rest,
          relevance: {
            score: _relevanceScore ?? 0,
            highestScoreInResults,
            maxPossibleScore,
            hasContentFilters,
            matchedIngredients: _matchedIngredients ?? 0,
            matchedCategories: _matchedCategories ?? 0,
            hasTimeMatch: true,
            hasQueryMatch: true,
          },
        };
      }
    );
  }

  return c.json(
    {
      recipes,
      total: seedInMemory ? Math.min(total, MAX_SEED_RESULTS) : total,
      page,
      pageSize,
      totalPages: Math.ceil(
        (seedInMemory ? Math.min(total, MAX_SEED_RESULTS) : total) / pageSize
      ),
    },
    200
  );
};

export default getRecipes;
