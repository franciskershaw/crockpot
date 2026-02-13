import { UserRole } from "@/data/types";
import useAxios from "@/hooks/axios/useAxios";
import { useOptimisticMutation } from "@/hooks/shared/useOptimisticMutation";
import useUser from "@/hooks/user/useUser";
import { queryKeys } from "@/lib/constants";

interface AddManualShoppingListItemInput {
  itemId: string;
  unitId?: string | null;
  quantity: number;
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

const useAddManualShoppingListItem = () => {
  const api = useAxios();
  const { user } = useUser();

  const addManualItemFn = async (input: AddManualShoppingListItemInput) => {
    const response = await api.post("/api/shopping-list/item", input, {
      headers: { Authorization: `Bearer ${user?.accessToken}` },
    });
    return response.data;
  };

  return useOptimisticMutation<
    AddManualShoppingListItemInput,
    unknown,
    ShoppingListData
  >({
    mutationFn: addManualItemFn,
    queryKey: [queryKeys.SHOPPING_LIST],
    optimisticUpdate: (previous, input) => {
      if (!previous) return previous;

      const keyMatches = (it: ShoppingListItem) =>
        it.itemId === input.itemId &&
        (it.unitId ?? null) === (input.unitId ?? null) &&
        it.isManual === true;

      const existingIndex = previous.items.findIndex(keyMatches);
      let nextItems;

      if (existingIndex >= 0) {
        // Item already exists - increment quantity
        nextItems = previous.items.map((it, idx) =>
          idx === existingIndex
            ? { ...it, quantity: it.quantity + input.quantity }
            : it
        );
      } else {
        // Add new manual item
        nextItems = [
          ...previous.items,
          {
            itemId: input.itemId,
            unitId: input.unitId ?? null,
            quantity: input.quantity,
            obtained: false,
            isManual: true,
          },
        ];
      }

      return {
        ...previous,
        items: nextItems,
      };
    },
    minimumRole: UserRole.FREE,
  });
};

export default useAddManualShoppingListItem;
