import { Context } from "hono";

import mongoose from "mongoose";

import { NotFoundError } from "../../../core/utils/errors";
import { removeItemFromShoppingList } from "../services/shoppingList.service";
import { RemoveShoppingListItemInput } from "../validation/shoppingList.validation";

const removeShoppingListItem = async (c: Context) => {
  const userId = c.get("user")?._id;

  if (!userId) {
    throw new NotFoundError("User not found");
  }

  const body = await c.req.json<RemoveShoppingListItemInput>();
  const { itemId, unitId, isManual } = body;

  const itemObjectId = new mongoose.Types.ObjectId(itemId);
  const unitObjectId = unitId ? new mongoose.Types.ObjectId(unitId) : null;

  const updatedList = await removeItemFromShoppingList(
    userId,
    itemObjectId,
    unitObjectId,
    isManual
  );

  return c.json(
    { shoppingList: updatedList, message: "Item removed from shopping list" },
    200
  );
};

export default removeShoppingListItem;
