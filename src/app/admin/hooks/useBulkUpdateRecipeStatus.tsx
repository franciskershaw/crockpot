import { useBasicMutation } from "@/hooks/shared/useBasicMutation";
import { bulkUpdateRecipeStatus } from "@/actions/recipes";
import { queryKeys } from "@/lib/constants";

export function useBulkUpdateRecipeStatus() {
  return useBasicMutation<
    { recipeIds: string[]; approved: boolean },
    { success: boolean; count: number; message: string }
  >({
    mutationFn: bulkUpdateRecipeStatus,
    requireAuth: true,
    successMessage: (data) =>
      data.message || "Recipe statuses updated successfully!",
    invalidateQueries: [[queryKeys.RECIPES], [queryKeys.USER_RECIPES]],
  });
}
