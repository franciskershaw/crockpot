import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxios from "@/src/hooks/axios/useAxios";
import { queryKeys } from "@/src/providers/Providers";
import useUser from "@/src/hooks/auth/useUser";
import { createConfig, combineArrays } from "@/src/helper";
import useItemCategories from "@/src/hooks/items/useItemCategories";
import {
  ItemCategory,
  ShoppingListItem,
  GroupedShoppingList,
} from "@/src/types/types";
import useExtraItems from "./useExtraItems";
import { useMemo } from "react";

type ToggleVariables = {
  itemId: string;
  obtained: boolean;
};

const useShoppingList = () => {
  const queryClient = useQueryClient();
  const api = useAxios();
  const { user } = useUser();
  const { extraItems } = useExtraItems();

  const { itemCategories } = useItemCategories();

  // Requests
  const getShoppingListReq = async () => {
    const config = createConfig(user);
    const response = await api.get("/api/users/shoppingList", config);
    return response.data;
  };

  const toggleItemObtainedReq = async (itemId: string, obtained: boolean) => {
    const config = createConfig(user);
    const response = await api.put(
      `/api/users/shoppingList/${itemId}`,
      {
        obtained,
      },
      config
    );

    return response.data;
  };

  // useQuery hooks
  const { data: shoppingList = [] } = useQuery(
    [queryKeys.shoppingList],
    getShoppingListReq
  );

  // useMutation hook
  const { mutate: toggleObtained } = useMutation(
    (variables: ToggleVariables) =>
      toggleItemObtainedReq(variables.itemId, variables.obtained),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([queryKeys.user]);
        queryClient.invalidateQueries([queryKeys.shoppingList]);
      },
      onError: (error) => {
        console.error("Error toggling item obtained status:", error);
      },
    }
  );

  const combinedItemList = useMemo(
    () => combineArrays(shoppingList, extraItems),
    [shoppingList, extraItems]
  );

  const groupedShoppingList: GroupedShoppingList[] = useMemo(() => {
    return itemCategories.reduce<GroupedShoppingList[]>(
      (acc, category: ItemCategory) => {
        const itemsInCategory: ShoppingListItem[] = combinedItemList.filter(
          (shopItem: ShoppingListItem) =>
            shopItem.item.category === category._id
        );
        if (itemsInCategory.length > 0) {
          acc.push({
            categoryId: category._id,
            categoryName: category.name,
            faIcon: category.faIcon,
            items: itemsInCategory,
          });
        }
        return acc;
      },
      []
    );
  }, [itemCategories, combinedItemList]);

  return { groupedShoppingList, toggleObtained };
};

export default useShoppingList;