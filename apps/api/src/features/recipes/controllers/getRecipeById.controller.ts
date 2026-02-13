import { Context } from "hono";

import { NotFoundError } from "../../../core/utils/errors";
import { UserRole } from "../../../shared/types";
import Recipe from "../model/recipe.model";

const getRecipeById = async (c: Context) => {
  const recipeId = c.req.param("id");
  const userId = c.get("user")?._id;
  const userRole = c.get("user")?.role;

  const recipe = await Recipe.findById(recipeId);
  if (!recipe) {
    throw new NotFoundError("Recipe not found");
  }

  const canSendRecipe =
    recipe.approved ||
    userRole === UserRole.ADMIN ||
    recipe.createdById === userId;

  if (!canSendRecipe) {
    throw new NotFoundError("Recipe not found");
  }

  return c.json(recipe, 200);
};

export default getRecipeById;
