import { useBasicMutation } from "@/hooks/shared/useBasicMutation";
import { createItem } from "@/actions/items";
import type { Item } from "@/data/types";
import type { CreateItemInput } from "@/lib/validations";
import { tags } from "@/lib/constants";

export function useCreateItem() {
  return useBasicMutation<
    CreateItemInput,
    { success: boolean; item: Item; message: string }
  >({
    mutationFn: createItem,
    requireAuth: true,
    successMessage: (data) => data.message || "Item created successfully!",
    errorMessage: "Failed to create item. Please try again.",
    invalidateQueries: [[tags.ITEMS], [tags.CATEGORIES]],
  });
}
