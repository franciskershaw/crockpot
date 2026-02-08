import { Context } from "hono";

import mongoose from "mongoose";

import Item from "../model/item.model";
import type { GetItemsQuery } from "../validation/getItems.item.validation";

const WATER_ITEM_ID = new mongoose.Types.ObjectId("6310ad7242687f4a1cf7f26a");
const HOUSE_CATEGORY_ID = new mongoose.Types.ObjectId(
  "6310a881b61a0ace3a1281ec"
);

const getItems = async (c: Context) => {
  const query = (c.req as { valid: (key: "query") => GetItemsQuery }).valid(
    "query"
  );
  const mode = query.mode ?? "all";

  const filter: Record<string, unknown> = {};
  if (mode === "all") {
    filter._id = { $ne: WATER_ITEM_ID };
  } else {
    filter.categoryId = { $ne: HOUSE_CATEGORY_ID };
  }

  const items = await Item.aggregate([
    { $match: filter },
    { $sort: { name: 1 } },
    {
      $lookup: {
        from: "ItemCategory",
        localField: "categoryId",
        foreignField: "_id",
        as: "category",
      },
    },
    { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "Unit",
        localField: "allowedUnitIds",
        foreignField: "_id",
        as: "allowedUnits",
      },
    },
    {
      $project: {
        categoryId: 0,
        allowedUnitIds: 0,
      },
    },
  ]);

  return c.json(items, 200);
};

export default getItems;
