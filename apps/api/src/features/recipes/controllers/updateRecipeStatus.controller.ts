import { Context } from "hono";

import { NotFoundError } from "../../../core/utils/errors";
import Recipe from "../model/recipe.model";
import type { UpdateRecipeStatusInput } from "../validation/getRecipes.recipe.validation";

const updateRecipeStatus = async (c: Context) => {
  const recipeId = c.req.param("id");
  const body = (
    c.req as { valid: (key: "json") => UpdateRecipeStatusInput }
  ).valid("json");

  // Check if recipe exists
  const recipe = await Recipe.findById(recipeId);
  if (!recipe) {
    throw new NotFoundError("Recipe not found");
  }

  // Update the recipe status
  const updatedRecipe = await Recipe.findByIdAndUpdate(
    recipeId,
    { approved: body.approved },
    { new: true }
  ).select("_id name approved");

  if (!updatedRecipe) {
    throw new NotFoundError("Recipe not found");
  }

  return c.json(updatedRecipe, 200);
};

export default updateRecipeStatus;
