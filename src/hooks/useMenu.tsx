// For use in client components that need to mutate the menu

import {
  addRecipeToMenu,
  removeRecipeFromMenu,
  getUserMenu,
} from "@/actions/menu";
import { useAuthenticatedQuery } from "./shared/useAuthenticatedQuery";
import { useBasicMutation } from "./shared/useBasicMutation";

export const useAddToMenuMutation = () => {
  return useBasicMutation({
    mutationFn: addRecipeToMenu,
    invalidateQueries: [["menu"], ["shopping-list"]],
    successMessage: (result) => result.wasUpdate 
      ? "Menu serving size updated"
      : "Recipe added to menu",
    errorMessage: "Failed to add recipe to menu",
    requireAuth: true, // Enable authentication checks
  });
};

export const useRemoveFromMenuMutation = () => {
  return useBasicMutation({
    mutationFn: removeRecipeFromMenu,
    invalidateQueries: [["menu"], ["shopping-list"]],
    successMessage: "Recipe removed from menu",
    errorMessage: "Failed to remove recipe from menu",
    requireAuth: true, // Enable authentication checks
  });
};

export const useGetMenu = () => {
  const { data, isLoading, error, isError, isAuthenticated } = useAuthenticatedQuery(
    ["menu"],
    getUserMenu
  );

  return {
    menu: data,
    isLoading,
    error,
    isError,
    isAuthenticated,
  };
};
