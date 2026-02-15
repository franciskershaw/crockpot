import useAxios from "@/hooks/axios/useAxios";
import { useOptimisticMutation } from "@/hooks/shared/useOptimisticMutation";
import useUser from "@/hooks/user/useUser";
import { queryKeys } from "@/lib/constants";
import { UserRole } from "@/shared/types";

interface UpdateShoppingListItemQuantityInput {
  itemId: string;
  unitId?: string | null;
  quantity: number;
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

const useUpdateShoppingListItemQuantity = () => {
  const api = useAxios();
  const { user } = useUser();

  const updateQuantityFn = async (
    input: UpdateShoppingListItemQuantityInput
  ) => {
    const response = await api.patch(
      "/api/shopping-list/item/quantity",
      input,
      {
        headers: { Authorization: `Bearer ${user?.accessToken}` },
      }
    );
    return response.data;
  };

  return useOptimisticMutation<
    UpdateShoppingListItemQuantityInput,
    unknown,
    ShoppingListData
  >({
    mutationFn: updateQuantityFn,
    queryKey: [queryKeys.SHOPPING_LIST],
    optimisticUpdate: (previous, input) => {
      if (!previous) return previous;

      return {
        ...previous,
        items: previous.items.map((item: ShoppingListItem) =>
          item.itemId === input.itemId &&
          (item.unitId ?? null) === (input.unitId ?? null)
            ? { ...item, quantity: input.quantity }
            : item
        ),
      };
    },
    minimumRole: UserRole.FREE,
  });
};

export default useUpdateShoppingListItemQuantity;
