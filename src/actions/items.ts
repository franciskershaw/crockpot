import {
  getItems as getItemsFromDAL,
  getIngredients as getIngredientsFromDAL,
} from "@/data/items/getItems";

export async function getItems() {
  return await getItemsFromDAL();
}

export async function getIngredients() {
  return await getIngredientsFromDAL();
}
