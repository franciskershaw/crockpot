import { useQuery } from "@tanstack/react-query";
import { getUserCreatedRecipes } from "@/actions/user-recipes";

export const useGetUserRecipes = () => {
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["user-recipes"],
    queryFn: getUserCreatedRecipes,
  });

  return {
    userRecipes: data,
    isLoading,
    error,
    isError,
  };
};
