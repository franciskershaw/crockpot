import { Context } from "hono";

import mongoose from "mongoose";

import { BadRequestError, NotFoundError } from "../../../core/utils/errors";
import Item from "../model/item.model";

const deleteItem = async (c: Context) => {
  const itemId = c.req.param("id");

  // Check if item exists
  const item = await Item.findById(itemId);
  if (!item) {
    throw new NotFoundError("Item not found");
  }

  // Check if item is used in any recipes
  const Recipe = mongoose.model("Recipe");
  const recipeCount = await Recipe.countDocuments({
    "ingredients.itemId": new mongoose.Types.ObjectId(itemId),
  });

  if (recipeCount > 0) {
    throw new BadRequestError(
      `Cannot delete item. It is used in ${recipeCount} recipe${recipeCount > 1 ? "s" : ""}`
    );
  }

  // Populate the item before deletion to return the full object
  const populatedItem = await Item.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(itemId) } },
    {
      $lookup: {
        from: "ItemCategory",
        localField: "categoryId",
        foreignField: "_id",
        as: "categoryId",
      },
    },
    { $unwind: { path: "$categoryId", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "Unit",
        localField: "allowedUnitIds",
        foreignField: "_id",
        as: "allowedUnitIds",
      },
    },
  ]);

  // Delete the item
  await Item.findByIdAndDelete(itemId);

  return c.json(populatedItem[0], 200);
};

export default deleteItem;
