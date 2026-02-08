import { Context } from "hono";

import Recipe from "../model/recipe.model";

const DEFAULT_MAX_MINUTES = 120;

const getRecipeTimeRange = async (c: Context) => {
  const [result] = await Recipe.aggregate<{ min: number; max: number }>([
    { $match: { approved: true } },
    {
      $group: {
        _id: null,
        min: { $min: "$timeInMinutes" },
        max: { $max: "$timeInMinutes" },
      },
    },
  ]);

  const min = result?.min ?? 0;
  const max = result?.max ?? DEFAULT_MAX_MINUTES;

  return c.json({ min, max }, 200);
};

export default getRecipeTimeRange;
