import { UserRole } from "@/data/types";
import useAxios from "@/hooks/axios/useAxios";
import { useOptimisticMutation } from "@/hooks/shared/useOptimisticMutation";
import useUser from "@/hooks/user/useUser";
import { queryKeys } from "@/lib/constants";

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

const useClearShoppingList = () => {
  const api = useAxios();
  const { user } = useUser();

  const clearShoppingListFn = async () => {
    const response = await api.delete("/api/shopping-list", {
      headers: { Authorization: `Bearer ${user?.accessToken}` },
    });
    return response.data;
  };

  return useOptimisticMutation<void, unknown, ShoppingListData>({
    mutationFn: clearShoppingListFn,
    queryKey: [queryKeys.SHOPPING_LIST],
    optimisticUpdate: (previous) => {
      if (!previous) return previous;
      return { ...previous, items: [] };
    },
    successMessage: "Shopping list cleared",
    minimumRole: UserRole.FREE,
  });
};

export default useClearShoppingList;
