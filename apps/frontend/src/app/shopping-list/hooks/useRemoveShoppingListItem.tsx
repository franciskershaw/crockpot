import { UserRole } from "@/data/types";
import useAxios from "@/hooks/axios/useAxios";
import { useOptimisticMutation } from "@/hooks/shared/useOptimisticMutation";
import useUser from "@/hooks/user/useUser";
import { queryKeys } from "@/lib/constants";

interface RemoveShoppingListItemInput {
  itemId: string;
  unitId?: string | null;
  isManual?: boolean;
}

interface ShoppingListItem {
  itemId: string;
  unitId: string | null;
  quantity: number;
  obtained: boolean;
  isManual?: boolean;
  [key: string]: unknown;
}

interface ShoppingListData {
  items: ShoppingListItem[];
  [key: string]: unknown;
}

const useRemoveShoppingListItem = () => {
  const api = useAxios();
  const { user } = useUser();

  const removeItemFn = async (input: RemoveShoppingListItemInput) => {
    const response = await api.delete("/api/shopping-list/item", {
      data: input,
      headers: { Authorization: `Bearer ${user?.accessToken}` },
    });
    return response.data;
  };

  return useOptimisticMutation<
    RemoveShoppingListItemInput,
    unknown,
    ShoppingListData
  >({
    mutationFn: removeItemFn,
    queryKey: [queryKeys.SHOPPING_LIST],
    optimisticUpdate: (previous, input) => {
      if (!previous) return previous;

      return {
        ...previous,
        items: previous.items.filter(
          (item: ShoppingListItem) =>
            !(
              item.itemId === input.itemId &&
              (item.unitId ?? null) === (input.unitId ?? null)
            )
        ),
      };
    },
    minimumRole: UserRole.FREE,
  });
};

export default useRemoveShoppingListItem;
