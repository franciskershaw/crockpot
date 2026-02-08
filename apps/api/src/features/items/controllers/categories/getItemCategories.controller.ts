import { Context } from "hono";

import ItemCategory from "../../model/itemCategory.model";

const getItemCategories = async (c: Context) => {
  const categories = await ItemCategory.find().sort({ name: 1 }).lean();
  return c.json(categories, 200);
};

export default getItemCategories;
