// For use in client components that need to mutate the menu

import {
  addRecipeToMenu,
  removeRecipeFromMenu,
  getUserMenu,
} from "@/actions/menu";
import { useAuthenticatedQuery } from "./shared/useAuthenticatedQuery";
import { useBasicMutation } from "./shared/useBasicMutation";
import { queryKeys } from "@/lib/constants";

export const useAddToMenuMutation = () => {
  return useBasicMutation({
    mutationFn: addRecipeToMenu,
    invalidateQueries: [[queryKeys.MENU], [queryKeys.SHOPPING_LIST]],
    successMessage: (result) =>
      result.wasUpdate ? "Menu serving size updated" : "Recipe added to menu",
    requireAuth: true, // Enable authentication checks
  });
};

export const useRemoveFromMenuMutation = () => {
  return useBasicMutation({
    mutationFn: removeRecipeFromMenu,
    invalidateQueries: [[queryKeys.MENU], [queryKeys.SHOPPING_LIST]],
    successMessage: "Recipe removed from menu",
    requireAuth: true, // Enable authentication checks
  });
};

export const useGetMenu = () => {
  const { data, isLoading, error, isError, isAuthenticated } =
    useAuthenticatedQuery([queryKeys.MENU], getUserMenu);

  return {
    menu: data,
    isLoading,
    error,
    isError,
    isAuthenticated,
  };
};
