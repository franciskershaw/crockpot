// For use in client components that need to mutate the menu

import {
  addRecipeToMenu,
  removeRecipeFromMenu,
  getUserMenu,
} from "@/actions/menu";
import { useAuthenticatedQuery } from "./shared/useAuthenticatedQuery";
import { useAuthenticatedMutation } from "./shared/useBasicMutation";
import { queryKeys } from "@/lib/constants";
import { UserRole } from "@/data/types";

export const useAddToMenuMutation = () => {
  return useAuthenticatedMutation({
    mutationFn: addRecipeToMenu,
    invalidateQueries: [[queryKeys.MENU], [queryKeys.SHOPPING_LIST]],
    successMessage: (result) =>
      result.wasUpdate ? "Menu serving size updated" : "Recipe added to menu",
    minimumRole: UserRole.FREE,
  });
};

export const useRemoveFromMenuMutation = () => {
  return useAuthenticatedMutation({
    mutationFn: removeRecipeFromMenu,
    invalidateQueries: [[queryKeys.MENU], [queryKeys.SHOPPING_LIST]],
    successMessage: "Recipe removed from menu",
    minimumRole: UserRole.FREE,
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
