import { useAuthenticatedMutation } from "@/hooks/shared/useAuthenticatedMutation";
import { updateRecipeStatus } from "@/actions/recipes";
import { queryKeys } from "@/lib/constants";
import { UserRole } from "@/data/types";

export function useUpdateRecipeStatus() {
  return useAuthenticatedMutation<
    { recipeId: string; approved: boolean },
    {
      success: boolean;
      recipe: { name: string; id: string; approved: boolean };
      message: string;
    }
  >({
    mutationFn: updateRecipeStatus,
    minimumRole: UserRole.ADMIN,
    successMessage: (data) =>
      data.message || "Recipe status updated successfully!",
    invalidateQueries: [[queryKeys.RECIPES], [queryKeys.USER_RECIPES]],
  });
}
