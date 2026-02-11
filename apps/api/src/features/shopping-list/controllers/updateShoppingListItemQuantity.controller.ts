import { Context } from "hono";

import mongoose from "mongoose";

import { NotFoundError } from "../../../core/utils/errors";
import { updateShoppingListItemQuantity as updateQuantityService } from "../services/shoppingList.service";
import { UpdateShoppingListItemQuantityInput } from "../validation/shoppingList.validation";

const updateShoppingListItemQuantity = async (c: Context) => {
  const userId = c.get("user")?._id;

  if (!userId) {
    throw new NotFoundError("User not found");
  }

  const body = await c.req.json<UpdateShoppingListItemQuantityInput>();
  const { itemId, unitId, quantity, isManual } = body;

  const itemObjectId = new mongoose.Types.ObjectId(itemId);
  const unitObjectId = unitId ? new mongoose.Types.ObjectId(unitId) : null;

  const updatedList = await updateQuantityService(
    userId,
    itemObjectId,
    unitObjectId,
    quantity,
    isManual
  );

  return c.json(
    { shoppingList: updatedList, message: "Item quantity updated" },
    200
  );
};

export default updateShoppingListItemQuantity;
