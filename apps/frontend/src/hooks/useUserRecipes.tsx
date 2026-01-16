import {
  getUserCreatedRecipes,
  getUserRecipeCount,
} from "@/actions/user-recipes";
import { useAuthenticatedQuery } from "./shared/useAuthenticatedQuery";
import { queryKeys } from "@/lib/constants";

export const useGetUserRecipes = () => {
  const { data, isLoading, error, isError, isAuthenticated } =
    useAuthenticatedQuery([queryKeys.USER_RECIPES], getUserCreatedRecipes);

  return {
    userRecipes: data,
    isLoading,
    error,
    isError,
    isAuthenticated,
  };
};

export const useGetUserRecipeCount = () => {
  const { data, isLoading, error, isError, isAuthenticated } =
    useAuthenticatedQuery([queryKeys.USER_RECIPE_COUNT], getUserRecipeCount);

  return {
    recipeCount: data ?? 0,
    isLoading,
    error,
    isError,
    isAuthenticated,
  };
};
