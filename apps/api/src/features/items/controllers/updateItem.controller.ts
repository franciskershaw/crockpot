import { Context } from "hono";

import mongoose from "mongoose";

import { BadRequestError, NotFoundError } from "../../../core/utils/errors";
import Item from "../model/item.model";
import ItemCategory from "../model/itemCategory.model";
import type { UpdateItemInput } from "../validation/getItems.item.validation";

const updateItem = async (c: Context) => {
  const itemId = c.req.param("id");
  const body = (c.req as { valid: (key: "json") => UpdateItemInput }).valid(
    "json"
  );

  // Check if item exists
  const item = await Item.findById(itemId);
  if (!item) {
    throw new NotFoundError("Item not found");
  }

  // Validate category if being updated
  if (body.categoryId) {
    const categoryExists = await ItemCategory.findById(body.categoryId);
    if (!categoryExists) {
      throw new BadRequestError("Category not found");
    }
  }

  // Validate units if being updated
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

  // Build update object
  const updateData: Record<string, unknown> = {};
  if (body.name !== undefined) updateData.name = body.name;
  if (body.categoryId !== undefined) {
    updateData.categoryId = new mongoose.Types.ObjectId(body.categoryId);
  }
  if (body.allowedUnitIds !== undefined) {
    updateData.allowedUnitIds = body.allowedUnitIds.map(
      (id) => new mongoose.Types.ObjectId(id)
    );
  }

  // Update the item
  await Item.findByIdAndUpdate(itemId, updateData);

  // Populate and return the item with the same format as getItems
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

  if (!populatedItem[0]) {
    throw new NotFoundError("Item not found after update");
  }

  return c.json(populatedItem[0], 200);
};

export default updateItem;
