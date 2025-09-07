import { useBasicMutation } from "@/hooks/shared/useBasicMutation";
import { updateRecipeStatus } from "@/actions/recipes";
import { queryKeys } from "@/lib/constants";

export function useUpdateRecipeStatus() {
  return useBasicMutation<
    { recipeId: string; approved: boolean },
    {
      success: boolean;
      recipe: { name: string; id: string; approved: boolean };
      message: string;
    }
  >({
    mutationFn: updateRecipeStatus,
    requireAuth: true,
    successMessage: (data) =>
      data.message || "Recipe status updated successfully!",
    invalidateQueries: [[queryKeys.RECIPES], [queryKeys.USER_RECIPES]],
  });
}
