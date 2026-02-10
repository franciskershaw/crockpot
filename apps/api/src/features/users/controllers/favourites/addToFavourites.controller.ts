import { Context } from "hono";

import mongoose from "mongoose";

import { NotFoundError } from "../../../../core/utils/errors";
import Recipe from "../../../recipes/model/recipe.model";
import User from "../../model/user.model";
import { FavouritesInput } from "../../validation/favourites.user.validation";

const addToFavourites = async (c: Context) => {
  // Get current user
  const userId = c.get("user")?._id;
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError("User not found");
  }

  // Verify recipe exists
  const { recipeId } = await c.req.json<FavouritesInput>();
  const recipe = await Recipe.findById(recipeId).lean();
  if (!recipe) {
    throw new NotFoundError("Recipe not found");
  }

  // Check if recipe is already favourited
  const isAlreadyFavourited = user.favouriteRecipeIds.some(
    (id) => id.toString() === recipeId
  );

  if (isAlreadyFavourited) {
    return c.json(
      { wasAdded: false, message: "Recipe already favourited" },
      200
    );
  }

  // Add recipe to favourites
  user.favouriteRecipeIds.push(new mongoose.Types.ObjectId(recipeId));
  await user.save();

  return c.json({ wasAdded: true, message: "Recipe added to favourites" }, 200);
};

export default addToFavourites;
