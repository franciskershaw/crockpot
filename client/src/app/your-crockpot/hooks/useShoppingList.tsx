import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxios from '@/src/hooks/axios/useAxios';
import { queryKeys } from '@/src/providers/Providers';
import useUser from '@/src/hooks/auth/useUser';
import { createConfig } from '@/src/helper';
import useItemCategories from '@/src/hooks/items/useItemCategories';
import {
  ItemCategory,
  ShoppingListItem,
  GroupedShoppingList,
} from '@/src/types/types';
import useExtraItems from './useExtraItems';

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
    const response = await api.get('/api/users/shoppingList', config);
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
        console.error('Error toggling item obtained status:', error);
      },
    }
  );

  // A helper function to find an existing category group by ID
  const findGroupById = (acc, categoryId) =>
    acc.find((group) => group.categoryId === categoryId);

  // A helper function to sum the quantities of items
  const sumQuantities = (existingItem, newItem) => {
    // Check if the existing item has been obtained or not and sum accordingly
    if (!existingItem.obtained) {
      existingItem.quantity += newItem.quantity;
    }
  };

  // A function to combine and deduplicate items from both lists
  const combineAndGroupItems = (itemCategories, shoppingList, extraItems) => {
    // First, combine both lists
    const combinedItems = [...shoppingList, ...extraItems];

    // Then, reduce the combined items into grouped categories
    return itemCategories.reduce((acc, category) => {
      combinedItems.forEach((item) => {
        if (item.item.category === category._id) {
          // Check if the group for this category already exists
          let group = findGroupById(acc, category._id);

          // If the group exists, try to find the item within the group
          if (group) {
            let existingItem = group.items.find(
              (it) => it.item._id === item.item._id
            );

            // If the item exists, sum the quantities
            if (existingItem) {
              sumQuantities(existingItem, item);
            } else {
              // Otherwise, add the new item to the group
              group.items.push(item);
            }
          } else {
            // If the group doesn't exist, create a new one and add the item
            acc.push({
              categoryId: category._id,
              categoryName: category.name,
              faIcon: category.faIcon,
              items: [item],
            });
          }
        }
      });
      return acc;
    }, []);
  };

  const groupedShoppingList = combineAndGroupItems(
    itemCategories,
    shoppingList,
    extraItems
  );
  console.log(groupedShoppingList);

  return { groupedShoppingList, toggleObtained };
};

export default useShoppingList;
