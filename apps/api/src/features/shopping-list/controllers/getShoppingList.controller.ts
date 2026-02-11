import { Context } from "hono";

import { NotFoundError } from "../../../core/utils/errors";
import { getUserShoppingListWithDetails } from "../services/shoppingList.service";

const getShoppingList = async (c: Context) => {
  const userId = c.get("user")?._id;

  if (!userId) {
    throw new NotFoundError("User not found");
  }

  const shoppingList = await getUserShoppingListWithDetails(userId);

  if (!shoppingList) {
    return c.json({ items: [] }, 200);
  }

  return c.json(shoppingList, 200);
};

export default getShoppingList;
