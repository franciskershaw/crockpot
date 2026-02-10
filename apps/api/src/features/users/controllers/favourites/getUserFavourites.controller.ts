import { Context } from "hono";

import { NotFoundError } from "../../../../core/utils/errors";
import Recipe from "../../../recipes/model/recipe.model";
import User from "../../model/user.model";

const getUserFavourites = async (c: Context) => {
  const userId = c.get("user")?._id;
  const user = await User.findById(userId).lean();
  if (!user) {
    throw new NotFoundError("User not found");
  }

  // Fetch the full recipe details for favourited recipes
  const favouriteRecipes = await Recipe.find({
    _id: { $in: user.favouriteRecipeIds },
  })
    .populate("categoryIds")
    .populate({
      path: "ingredients.itemId",
      populate: {
        path: "allowedUnitIds categoryId",
      },
    })
    .populate("ingredients.unitId")
    .lean();

  return c.json(favouriteRecipes, 200);
};

export default getUserFavourites;
