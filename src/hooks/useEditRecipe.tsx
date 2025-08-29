import { useBasicMutation } from "@/hooks/shared/useBasicMutation";
import { editRecipe } from "@/actions/recipes";
import { useRouter } from "next/navigation";
import type { Recipe } from "@/data/types";

export function useEditRecipe() {
  const router = useRouter();

  return useBasicMutation<
    FormData,
    { success: boolean; recipe: Recipe; message: string }
  >({
    mutationFn: editRecipe,
    requireAuth: true,
    successMessage: (data) => data.message || "Recipe updated successfully!",
    errorMessage: "Failed to update recipe. Please try again.",
    invalidateQueries: [["recipes"], ["user-recipes"], ["recipeCount"]],
    onSuccess: (data) => {
      if (data.success && data.recipe) {
        router.push(`/recipes/${data.recipe.id}`);
      }
    },
  });
}
