import { useQuery } from '@tanstack/react-query';
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

const useShoppingList = () => {
  const api = useAxios();
  const { user } = useUser();

  const { itemCategories } = useItemCategories();

  const getShoppingList = async () => {
    const config = createConfig(user);
    const response = await api.get('/api/users/shoppingList', config);
    return response.data;
  };

  const { data: shoppingList = [] } = useQuery(
    [queryKeys.shoppingList],
    getShoppingList
  );

  const groupedShoppingList: GroupedShoppingList[] = itemCategories.reduce<
    GroupedShoppingList[]
  >((acc, category: ItemCategory) => {
    const itemsInCategory: ShoppingListItem[] = shoppingList.filter(
      (shopItem: ShoppingListItem) => shopItem.item.category === category._id
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
  }, []);

  return { groupedShoppingList };
};

export default useShoppingList;
