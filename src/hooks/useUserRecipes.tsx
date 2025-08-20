import { getUserCreatedRecipes } from "@/actions/user-recipes";
import { useAuthenticatedQuery } from "./shared/useAuthenticatedQuery";

export const useGetUserRecipes = () => {
  const { data, isLoading, error, isError, isAuthenticated } =
    useAuthenticatedQuery(["user-recipes"], getUserCreatedRecipes);

  return {
    userRecipes: data,
    isLoading,
    error,
    isError,
    isAuthenticated,
  };
};
