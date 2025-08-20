"use server";

import {
  getItems as getItemsFromDAL,
  getIngredients as getIngredientsFromDAL,
} from "@/data/items/getItems";
import { createPublicAction } from "@/lib/action-helpers";

export const getItems = createPublicAction(async () => {
  return await getItemsFromDAL();
});

export const getIngredients = createPublicAction(async () => {
  return await getIngredientsFromDAL();
});
