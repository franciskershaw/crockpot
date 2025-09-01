import { useBasicMutation } from "@/hooks/shared/useBasicMutation";
import { editRecipe } from "@/actions/recipes";
import { useRouter } from "next/navigation";
import type { Recipe } from "@/data/types";
import { queryKeys } from "@/lib/constants";

export function useEditRecipe() {
  const router = useRouter();

  return useBasicMutation<
    FormData,
    { success: boolean; recipe: Recipe; message: string }
  >({
    mutationFn: editRecipe,
    requireAuth: true,
    successMessage: (data) => data.message || "Recipe updated successfully!",
    invalidateQueries: [
      [queryKeys.RECIPES],
      [queryKeys.USER_RECIPES],
      [queryKeys.RECIPE_COUNT],
    ],
    onSuccess: (data) => {
      if (data.success && data.recipe) {
        router.push(`/recipes/${data.recipe.id}`);
      }
    },
  });
}
