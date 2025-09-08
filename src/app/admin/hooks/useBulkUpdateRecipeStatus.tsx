import { useAuthenticatedMutation } from "@/hooks/shared/useBasicMutation";
import { bulkUpdateRecipeStatus } from "@/actions/recipes";
import { queryKeys } from "@/lib/constants";
import { UserRole } from "@/data/types";

export function useBulkUpdateRecipeStatus() {
  return useAuthenticatedMutation<
    { recipeIds: string[]; approved: boolean },
    { success: boolean; count: number; message: string }
  >({
    mutationFn: bulkUpdateRecipeStatus,
    minimumRole: UserRole.ADMIN,
    successMessage: (data) =>
      data.message || "Recipe statuses updated successfully!",
    invalidateQueries: [[queryKeys.RECIPES], [queryKeys.USER_RECIPES]],
  });
}
