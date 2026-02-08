import { Context } from "hono";

import Recipe from "../../model/recipe.model";
import type { GetRecipesQuery } from "../../validation/getRecipes.recipe.validation";

const getRecipes = async (c: Context) => {
  const query = (c.req as { valid: (key: "query") => GetRecipesQuery }).valid(
    "query"
  );
  const page = query.page ?? 1;
  const pageSize = query.pageSize ?? 10;
  const skip = (page - 1) * pageSize;

  const [result] = await Recipe.aggregate([
    { $match: { approved: true } },
    {
      $facet: {
        recipes: [
          { $sort: { createdAt: -1 } },
          { $skip: skip },
          { $limit: pageSize },
          {
            $lookup: {
              from: "RecipeCategory",
              localField: "categoryIds",
              foreignField: "_id",
              as: "categories",
            },
          },
          {
            $project: {
              categoryIds: 0,
            },
          },
        ],
        total: [{ $count: "count" }],
      },
    },
  ]);

  const recipes = result.recipes ?? [];
  const total = result.total?.[0]?.count ?? 0;

  return c.json(
    {
      recipes,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    },
    200
  );
};

export default getRecipes;
