import { useBasicMutation } from "@/hooks/shared/useBasicMutation";
import { deleteItem } from "@/actions/items";
import type { Item } from "@/data/types";
import { queryKeys } from "@/lib/constants";

export function useDeleteItem() {
  return useBasicMutation<
    string,
    { success: boolean; item: Item; message: string }
  >({
    mutationFn: deleteItem,
    requireAuth: true,
    successMessage: (data) => data.message || "Item deleted successfully!",
    invalidateQueries: [[queryKeys.ITEMS], [queryKeys.INGREDIENTS]],
  });
}
