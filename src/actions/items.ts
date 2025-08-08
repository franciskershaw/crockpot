import { getItems as getItemsFromDAL } from "@/data/items/getItems";

export async function getItems() {
  return await getItemsFromDAL();
}
