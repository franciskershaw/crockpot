import { Context } from "hono";

import { NotFoundError } from "../../../core/utils/errors";
import { UserRole } from "../../../shared/types";
import Recipe from "../model/recipe.model";

const getRecipeById = async (c: Context) => {
  const recipeId = c.req.param("id");
  const userId = c.get("user")?._id;
  const userRole = c.get("user")?.role;

  // Fetch recipe with populated relations
  const recipe = await Recipe.findById(recipeId)
    .populate("categoryIds", "name createdAt updatedAt") // Populate categories
    .populate("createdById", "_id name image") // Populate creator user info
    .populate({
      path: "ingredients.itemId", // Populate ingredient items
      select: "_id name categoryId allowedUnitIds createdAt updatedAt",
      populate: {
        path: "categoryId", // Populate item category
        select: "_id name faIcon createdAt updatedAt",
      },
    })
    .populate("ingredients.unitId", "_id name abbreviation createdAt updatedAt") // Populate ingredient units
    .lean();

  if (!recipe) {
    throw new NotFoundError("Recipe not found");
  }

  const canSendRecipe =
    recipe.approved ||
    userRole === UserRole.ADMIN ||
    recipe.createdById?._id?.toString() === userId;

  if (!canSendRecipe) {
    throw new NotFoundError("Recipe not found");
  }

  return c.json(recipe, 200);
};

export default getRecipeById;
