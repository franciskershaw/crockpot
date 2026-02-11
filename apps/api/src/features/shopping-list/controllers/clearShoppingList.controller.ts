import { Context } from "hono";

import { NotFoundError } from "../../../core/utils/errors";
import { clearAllItemsFromShoppingList } from "../services/shoppingList.service";

const clearShoppingList = async (c: Context) => {
  const userId = c.get("user")?._id;

  if (!userId) {
    throw new NotFoundError("User not found");
  }

  const updatedList = await clearAllItemsFromShoppingList(userId);

  return c.json(
    { shoppingList: updatedList, message: "Shopping list cleared" },
    200
  );
};

export default clearShoppingList;
