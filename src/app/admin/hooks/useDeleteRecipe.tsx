import { useBasicMutation } from "@/hooks/shared/useBasicMutation";
import { deleteRecipe } from "@/actions/recipes";
import { queryKeys } from "@/lib/constants";

export function useDeleteRecipe() {
  return useBasicMutation<
    string,
    {
      success: boolean;
      recipe: { name: string; id: string; approved: boolean };
      message: string;
    }
  >({
    mutationFn: deleteRecipe,
    requireAuth: true,
    successMessage: (data) => data.message || "Recipe deleted successfully!",
    invalidateQueries: [[queryKeys.RECIPES], [queryKeys.USER_RECIPES]],
  });
}
