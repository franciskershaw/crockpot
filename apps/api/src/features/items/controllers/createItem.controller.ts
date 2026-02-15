import { Context } from "hono";

import mongoose from "mongoose";

import { BadRequestError } from "../../../core/utils/errors";
import Item from "../model/item.model";
import ItemCategory from "../model/itemCategory.model";
import type { CreateItemInput } from "../validation/getItems.item.validation";

const createItem = async (c: Context) => {
  const body = (c.req as { valid: (key: "json") => CreateItemInput }).valid(
    "json"
  );

  // Validate that category exists
  const categoryExists = await ItemCategory.findById(body.categoryId);
  if (!categoryExists) {
    throw new BadRequestError("Category not found");
  }

  // Validate that all units exist if provided
  if (body.allowedUnitIds && body.allowedUnitIds.length > 0) {
    const Unit = mongoose.model("Unit");
    const unitsCount = await Unit.countDocuments({
      _id: {
        $in: body.allowedUnitIds.map((id) => new mongoose.Types.ObjectId(id)),
      },
    });
    if (unitsCount !== body.allowedUnitIds.length) {
      throw new BadRequestError("One or more units not found");
    }
  }

  // Create the item
  const item = await Item.create({
    name: body.name,
    categoryId: new mongoose.Types.ObjectId(body.categoryId),
    allowedUnitIds:
      body.allowedUnitIds?.map((id) => new mongoose.Types.ObjectId(id)) || [],
  });

  // Populate and return the item with the same format as getItems
  const populatedItem = await Item.aggregate([
    { $match: { _id: item._id } },
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

  return c.json(populatedItem[0], 201);
};

export default createItem;
