import { useBasicMutation } from "@/hooks/shared/useBasicMutation";
import { deleteRecipe } from "@/actions/recipes";
import { useRouter } from "next/navigation";
import type { Recipe } from "@/data/types";

export function useDeleteRecipe() {
  const router = useRouter();

  return useBasicMutation<
    string,
    { success: boolean; recipe: Recipe; message: string }
  >({
    mutationFn: deleteRecipe,
    requireAuth: true,
    successMessage: (data) => data.message || "Recipe deleted successfully!",
    errorMessage: "Failed to delete recipe. Please try again.",
    invalidateQueries: [["recipes"], ["user-recipes"], ["recipeCount"]],
    onSuccess: (data) => {
      if (data.success) {
        // Navigate back to recipes list after successful deletion
        router.push("/recipes");
      }
    },
  });
}
