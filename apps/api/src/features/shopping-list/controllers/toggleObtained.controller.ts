import { Context } from "hono";

import mongoose from "mongoose";

import { NotFoundError } from "../../../core/utils/errors";
import { toggleObtainedForItem } from "../services/shoppingList.service";
import { ToggleObtainedInput } from "../validation/shoppingList.validation";

const toggleObtained = async (c: Context) => {
  const userId = c.get("user")?._id;

  if (!userId) {
    throw new NotFoundError("User not found");
  }

  const body = await c.req.json<ToggleObtainedInput>();
  const { itemId, unitId, isManual } = body;

  const itemObjectId = new mongoose.Types.ObjectId(itemId);
  const unitObjectId = unitId ? new mongoose.Types.ObjectId(unitId) : null;

  const updatedList = await toggleObtainedForItem(
    userId,
    itemObjectId,
    unitObjectId,
    isManual
  );

  return c.json(
    { shoppingList: updatedList, message: "Item status updated" },
    200
  );
};

export default toggleObtained;
