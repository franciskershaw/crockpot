import { useBasicMutation } from "@/hooks/shared/useBasicMutation";
import { createRecipe } from "@/actions/recipes";
import { useRouter } from "next/navigation";
import type { Recipe } from "@/data/types";
import { queryKeys } from "@/lib/constants";

export function useCreateRecipe() {
  const router = useRouter();

  return useBasicMutation<
    FormData,
    { success: boolean; recipe: Recipe; message: string }
  >({
    mutationFn: createRecipe,
    requireAuth: true,
    successMessage: (data) => data.message || "Recipe created successfully!",
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
