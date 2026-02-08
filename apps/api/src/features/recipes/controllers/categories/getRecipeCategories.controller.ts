import { Context } from "hono";

import RecipeCategory from "../../model/recipeCategory.model";

const getRecipeCategories = async (c: Context) => {
  const categories = await RecipeCategory.find().sort({ name: 1 }).lean();

  return c.json(categories, 200);
};

export default getRecipeCategories;
