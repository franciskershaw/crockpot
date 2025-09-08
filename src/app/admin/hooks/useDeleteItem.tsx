import { useAuthenticatedMutation } from "@/hooks/shared/useBasicMutation";
import { deleteItem } from "@/actions/items";
import { UserRole, type Item } from "@/data/types";
import { queryKeys } from "@/lib/constants";

export function useDeleteItem() {
  return useAuthenticatedMutation<
    string,
    { success: boolean; item: Item; message: string }
  >({
    mutationFn: deleteItem,
    minimumRole: UserRole.ADMIN,
    successMessage: (data) => data.message || "Item deleted successfully!",
    invalidateQueries: [[queryKeys.ITEMS], [queryKeys.INGREDIENTS]],
  });
}
