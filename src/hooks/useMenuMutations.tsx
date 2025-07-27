// For use in client components that need to mutate the menu

import { addRecipeToMenu, removeRecipeFromMenu } from "@/actions/menu";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface SerializedError {
  message?: string;
  code?: string;
}

// Setup React Query mutations with error handling
export const useAddToMenuMutation = () =>
  useMutation({
    mutationFn: addRecipeToMenu,
    onSuccess: () => {
      toast.success("Recipe added to menu!");
    },
    onError: (error: SerializedError) => {
      toast.error(error.message || "Failed to add recipe to menu");
    },
  });

export const useRemoveFromMenuMutation = () =>
  useMutation({
    mutationFn: removeRecipeFromMenu,
    onSuccess: () => {
      toast.success("Recipe removed from menu");
    },
    onError: (error: SerializedError) => {
      toast.error(error.message || "Failed to remove recipe from menu");
    },
  });
