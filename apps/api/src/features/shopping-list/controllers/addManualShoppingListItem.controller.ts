import { Context } from "hono";

import mongoose from "mongoose";

import { NotFoundError } from "../../../core/utils/errors";
import { addManualItemToShoppingList } from "../services/shoppingList.service";
import { AddManualShoppingListItemInput } from "../validation/shoppingList.validation";

const addManualShoppingListItem = async (c: Context) => {
  const userId = c.get("user")?._id;

  if (!userId) {
    throw new NotFoundError("User not found");
  }

  const body = await c.req.json<AddManualShoppingListItemInput>();
  const { itemId, unitId, quantity } = body;

  const itemObjectId = new mongoose.Types.ObjectId(itemId);
  const unitObjectId = unitId ? new mongoose.Types.ObjectId(unitId) : null;

  const updatedList = await addManualItemToShoppingList(
    userId,
    itemObjectId,
    unitObjectId,
    quantity
  );

  return c.json(
    {
      shoppingList: updatedList,
      message: "Manual item added to shopping list",
    },
    200
  );
};

export default addManualShoppingListItem;
