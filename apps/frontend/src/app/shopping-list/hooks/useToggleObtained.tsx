import useAxios from "@/hooks/axios/useAxios";
import { useOptimisticMutation } from "@/hooks/shared/useOptimisticMutation";
import useUser from "@/hooks/user/useUser";
import { queryKeys } from "@/lib/constants";
import { UserRole } from "@/shared/types";

interface ToggleObtainedInput {
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

const useToggleObtained = () => {
  const api = useAxios();
  const { user } = useUser();

  const toggleObtainedFn = async (input: ToggleObtainedInput) => {
    const response = await api.patch(
      "/api/shopping-list/toggle-obtained",
      input,
      {
        headers: { Authorization: `Bearer ${user?.accessToken}` },
      }
    );
    return response.data;
  };

  return useOptimisticMutation<ToggleObtainedInput, unknown, ShoppingListData>({
    mutationFn: toggleObtainedFn,
    queryKey: [queryKeys.SHOPPING_LIST],
    optimisticUpdate: (previous, input) => {
      if (!previous) return previous;

      return {
        ...previous,
        items: previous.items.map((item: ShoppingListItem) =>
          item.itemId === input.itemId &&
          (item.unitId ?? null) === (input.unitId ?? null)
            ? { ...item, obtained: !item.obtained }
            : item
        ),
      };
    },
    minimumRole: UserRole.FREE,
  });
};

export default useToggleObtained;
