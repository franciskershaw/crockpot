import { Context } from "hono";

import { NotFoundError } from "../../../../core/utils/errors";
import User from "../../model/user.model";
import { FavouritesInput } from "../../validation/favourites.user.validation";

const removeFromFavourites = async (c: Context) => {
  const userId = c.get("user")?._id;

  if (!userId) {
    throw new NotFoundError("User not found");
  }

  const body = await c.req.json<FavouritesInput>();
  const { recipeId } = body;

  // Get current user
  const user = await User.findById(userId);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  // Check if recipe is in favourites
  const isFavourited = user.favouriteRecipeIds.some(
    (id) => id.toString() === recipeId
  );

  if (!isFavourited) {
    return c.json(
      { wasRemoved: false, message: "Recipe not in favourites" },
      200
    );
  }

  // Remove recipe from favourites
  user.favouriteRecipeIds = user.favouriteRecipeIds.filter(
    (id) => id.toString() !== recipeId
  );
  await user.save();

  return c.json(
    { wasRemoved: true, message: "Recipe removed from favourites" },
    200
  );
};

export default removeFromFavourites;
