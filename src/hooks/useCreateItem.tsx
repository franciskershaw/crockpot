import { useAuthenticatedMutation } from "@/hooks/shared/useBasicMutation";
import { createItem } from "@/actions/items";
import { UserRole, type Item } from "@/data/types";
import type { CreateItemInput } from "@/lib/validations";
import { tags } from "@/lib/constants";

export function useCreateItem() {
  return useAuthenticatedMutation<
    CreateItemInput,
    { success: boolean; item: Item; message: string }
  >({
    mutationFn: createItem,
    minimumRole: UserRole.ADMIN,
    successMessage: (data) => data.message || "Item created successfully!",
    invalidateQueries: [[tags.ITEMS], [tags.CATEGORIES]],
  });
}
