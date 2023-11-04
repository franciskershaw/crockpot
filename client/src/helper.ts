import { User, ShoppingListItem } from "@/src/types/types";

export const createConfig = (user: User) => {
  return {
    headers: {
      Authorization: `Bearer ${user?.accessToken}`,
    },
  };
};

// utils/combineArrays.ts
export function combineArrays(
  shoppingList: ShoppingListItem[],
  extraItems: ShoppingListItem[]
): ShoppingListItem[] {
  const tempStorage: { [key: string]: ShoppingListItem } = {};

  // Helper function to process each item
  const processItem = (item: ShoppingListItem, isExtra: boolean) => {
    const key = item.item._id + item.unit; // Unique key based on _id and unit
    if (tempStorage[key]) {
      tempStorage[key].quantity += item.quantity;
      if (isExtra) tempStorage[key].extra = true;
    } else {
      tempStorage[key] = { ...item };
      if (isExtra) tempStorage[key].extra = true;
    }
  };

  shoppingList.forEach((item) => processItem(item, false));
  extraItems.forEach((item) => processItem(item, true));

  const combinedArray = Object.values(tempStorage);

  return combinedArray;
}
