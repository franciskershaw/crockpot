import { Context } from "hono";

import type { PipelineStage } from "mongoose";

import {
  buildMatchFilter,
  buildRecipesPipeline,
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
    const seed = query.seed;
    recipes = [...recipes]
      .sort(
        (a, b) =>
          seededSortKey(String(a._id), seed) -
          seededSortKey(String(b._id), seed)
      )
      .slice(skip, skip + pageSize);
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
