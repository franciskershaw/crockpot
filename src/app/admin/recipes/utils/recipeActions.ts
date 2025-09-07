import { AdminRecipe } from "@/data/types";
import {
  updateRecipeStatus,
  bulkUpdateRecipeStatus,
  deleteRecipe,
} from "@/actions/recipes";
import { toast } from "sonner";

export async function changeRecipeStatus(
  recipeId: string,
  approved: boolean,
  onSuccess?: () => void
) {
  try {
    await updateRecipeStatus({ recipeId, approved });
    toast.success(`Recipe ${approved ? "approved" : "rejected"} successfully`);
    onSuccess?.();
  } catch (error) {
    console.error("Status change error:", error);
    toast.error("Failed to update recipe status");
  }
}

export async function changeRecipesStatus(
  recipeIds: string[],
  approved: boolean,
  onSuccess?: () => void
) {
  try {
    await bulkUpdateRecipeStatus({ recipeIds, approved });
    toast.success(
      `${recipeIds.length} recipe(s) ${
        approved ? "approved" : "rejected"
      } successfully`
    );
    onSuccess?.();
  } catch (error) {
    console.error("Bulk status change error:", error);
    toast.error("Failed to update recipe statuses");
  }
}

export function viewRecipe(recipe: AdminRecipe) {
  // Navigate to recipe page
  window.open(`/recipes/${recipe.id}`, "_blank");
}

export function editRecipe(
  recipe: AdminRecipe,
  router: { push: (path: string) => void }
) {
  // Navigate to edit page
  router.push(`/recipes/edit/${recipe.id}`);
}

export async function deleteRecipeAction(
  recipeId: string,
  onConfirm?: () => void
) {
  try {
    await deleteRecipe(recipeId);
    toast.success("Recipe deleted successfully");
    onConfirm?.();
  } catch (error) {
    console.error("Delete recipe error:", error);
    toast.error("Failed to delete recipe");
  }
}

export async function deleteRecipes(
  recipeIds: string[],
  onConfirm?: () => void
) {
  try {
    // Delete recipes in parallel
    await Promise.all(recipeIds.map((id) => deleteRecipe(id)));
    toast.success(`${recipeIds.length} recipe(s) deleted successfully`);
    onConfirm?.();
  } catch (error) {
    console.error("Bulk delete error:", error);
    toast.error("Failed to delete recipes");
  }
}
