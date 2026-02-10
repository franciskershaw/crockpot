import { Context } from "hono";

import { NotFoundError } from "../../../core/utils/errors";
import Recipe from "../../recipes/model/recipe.model";
import RecipeMenu from "../model/recipeMenu.model";

const getUserMenu = async (c: Context) => {
  const userId = c.get("user")?._id;

  if (!userId) {
    throw new NotFoundError("User not found");
  }

  const menu = await RecipeMenu.findOne({ userId }).lean();

  if (!menu) {
    return c.json({ entries: [], history: [] }, 200);
  }

  // Get all recipes for the menu entries
  const recipeIds = menu.entries.map((entry) => entry.recipeId);
  const recipes = await Recipe.find({ _id: { $in: recipeIds } })
    .populate("categoryIds")
    .lean();

  // Map recipes to entries
  const entriesWithRecipes = menu.entries.map((entry) => ({
    recipeId: entry.recipeId,
    serves: entry.serves,
    recipe: recipes.find(
      (recipe) => recipe._id.toString() === entry.recipeId.toString()
    ),
  }));

  return c.json(
    {
      ...menu,
      entries: entriesWithRecipes,
    },
    200
  );
};

export default getUserMenu;
