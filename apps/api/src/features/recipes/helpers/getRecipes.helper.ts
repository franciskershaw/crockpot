import type { PipelineStage } from "mongoose";
import mongoose from "mongoose";

import type { GetRecipesQuery } from "../validation/getRecipes.recipe.validation";

/** Max documents to load when using seed (Atlas free tier doesn't support $function). */
export const MAX_SEED_RESULTS = 2000;

/** Weight values for relevance score calculation. */
const W = {
  query: 20,
  category: 15,
  ingredient: 10,
  time: 5,
} as const;

function toObjectIds(
  ids: string[] | undefined
): mongoose.Types.ObjectId[] | null {
  return ids?.length ? ids.map((id) => new mongoose.Types.ObjectId(id)) : null;
}

function getFilterIds(query: GetRecipesQuery) {
  return {
    categoryIds: toObjectIds(query.categoryIds),
    ingredientIds: toObjectIds(query.ingredientIds),
  };
}

function hasRelevanceFilters(query: GetRecipesQuery): boolean {
  return (
    !!query.query?.trim() ||
    !!query.categoryIds?.length ||
    !!query.ingredientIds?.length ||
    query.minTime != null ||
    query.maxTime != null
  );
}

function scorePart(
  condition: boolean,
  expr: Record<string, unknown>
): number | Record<string, unknown> {
  return condition ? expr : 0;
}

/** Builds $addFields stage for _relevanceScore and match counts (for relevance badges). */
function buildRelevanceScoreStage(
  query: GetRecipesQuery
): PipelineStage.AddFields {
  const q = query.query?.trim() ?? "";
  const { categoryIds: filterCatIds, ingredientIds: filterIngIds } =
    getFilterIds(query);
  const hasTime = query.minTime != null || query.maxTime != null;
  const minT = query.minTime ?? 0;
  const maxT = query.maxTime ?? 9999;

  const sumParts: (number | Record<string, unknown>)[] = [
    scorePart(!!q.length, {
      $cond: [
        { $regexMatch: { input: "$name", regex: q, options: "i" } },
        W.query,
        0,
      ],
    }),
    scorePart(!!filterCatIds?.length, {
      $multiply: [
        W.category,
        { $size: { $setIntersection: ["$categoryIds", filterCatIds!] } },
      ],
    }),
    scorePart(!!filterIngIds?.length, {
      $multiply: [
        W.ingredient,
        {
          $size: {
            $filter: {
              input: "$ingredients",
              as: "ing",
              cond: { $in: ["$$ing.itemId", filterIngIds!] },
            },
          },
        },
      ],
    }),
    scorePart(hasTime, {
      $cond: [
        {
          $and: [
            { $gte: ["$timeInMinutes", minT] },
            { $lte: ["$timeInMinutes", maxT] },
          ],
        },
        W.time,
        0,
      ],
    }),
  ];

  const fields: Record<string, unknown> = {
    _relevanceScore: { $add: sumParts },
  };
  if (filterCatIds?.length) {
    fields._matchedCategories = {
      $size: { $setIntersection: ["$categoryIds", filterCatIds] },
    };
  } else {
    fields._matchedCategories = 0;
  }
  if (filterIngIds?.length) {
    fields._matchedIngredients = {
      $size: {
        $filter: {
          input: "$ingredients",
          as: "ing",
          cond: { $in: ["$$ing.itemId", filterIngIds] },
        },
      },
    };
  } else {
    fields._matchedIngredients = 0;
  }

  return { $addFields: fields };
}

export function seededSortKey(idStr: string, seedNum: number): number {
  const s = idStr + String(seedNum);
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h = h & h;
  }
  return Math.abs(h);
}

export function buildMatchFilter(
  query: GetRecipesQuery
): PipelineStage.Match["$match"] {
  const filter: PipelineStage.Match["$match"] = { approved: true };
  const { categoryIds, ingredientIds } = getFilterIds(query);

  if (query.minTime != null || query.maxTime != null) {
    filter.timeInMinutes = {};
    if (query.minTime != null) filter.timeInMinutes.$gte = query.minTime;
    if (query.maxTime != null) filter.timeInMinutes.$lte = query.maxTime;
  }
  const searchQuery = query.query?.trim();
  if (searchQuery) filter.name = { $regex: searchQuery, $options: "i" };
  if (categoryIds?.length) {
    filter.categoryIds =
      query.categoryMode === "exclude"
        ? { $nin: categoryIds }
        : { $in: categoryIds };
  }
  if (ingredientIds?.length)
    filter["ingredients.itemId"] = { $in: ingredientIds };

  return filter;
}

export function buildRecipesPipeline(
  query: GetRecipesQuery,
  skip: number,
  pageSize: number,
  seedInMemory: boolean
): PipelineStage[] {
  const useRelevance = hasRelevanceFilters(query);
  return [
    ...(useRelevance ? [buildRelevanceScoreStage(query)] : []),
    {
      $sort: useRelevance
        ? { _relevanceScore: -1, createdAt: -1 }
        : { createdAt: -1 },
    },
    ...(seedInMemory
      ? [{ $limit: MAX_SEED_RESULTS }]
      : [{ $skip: skip }, { $limit: pageSize }]),
    {
      $lookup: {
        from: "RecipeCategory",
        localField: "categoryIds",
        foreignField: "_id",
        as: "categories",
      },
    },
    { $project: { categoryIds: 0 } },
  ];
}
