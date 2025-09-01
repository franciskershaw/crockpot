import { useBasicMutation } from "@/hooks/shared/useBasicMutation";
import { deleteRecipe } from "@/actions/recipes";
import { useRouter } from "next/navigation";
import type { Recipe } from "@/data/types";
import { queryKeys } from "@/lib/constants";

export function useDeleteRecipe() {
  const router = useRouter();

  return useBasicMutation<
    string,
    { success: boolean; recipe: Recipe; message: string }
  >({
    mutationFn: deleteRecipe,
    requireAuth: true,
    successMessage: (data) => data.message || "Recipe deleted successfully!",
    invalidateQueries: [
      [queryKeys.RECIPES],
      [queryKeys.USER_RECIPES],
      [queryKeys.RECIPE_COUNT],
    ],
    onSuccess: (data) => {
      if (data.success) {
        // Navigate back to recipes list after successful deletion
        router.push("/recipes");
      }
    },
  });
}
