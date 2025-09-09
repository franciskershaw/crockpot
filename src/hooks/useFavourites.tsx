import {
  addRecipeToFavourites,
  getUserFavourites,
  removeRecipeFromFavourites,
} from "@/actions/favourites";
import { useAuthenticatedQuery } from "./shared/useAuthenticatedQuery";
import { useAuthenticatedMutation } from "./shared/useAuthenticatedMutation";
import { queryKeys } from "@/lib/constants";
import { UserRole } from "@/data/types";

export const useAddToFavouritesMutation = () => {
  return useAuthenticatedMutation({
    mutationFn: addRecipeToFavourites,
    invalidateQueries: [[queryKeys.FAVOURITES]],
    successMessage: "Recipe added to favourites",
    minimumRole: UserRole.FREE,
  });
};

export const useRemoveFromFavouritesMutation = () => {
  return useAuthenticatedMutation({
    mutationFn: removeRecipeFromFavourites,
    invalidateQueries: [[queryKeys.FAVOURITES]],
    successMessage: "Recipe removed from favourites",
    minimumRole: UserRole.FREE,
  });
};

export const useGetFavourites = () => {
  const { data, isLoading, error, isError, isAuthenticated } =
    useAuthenticatedQuery([queryKeys.FAVOURITES], getUserFavourites);

  return {
    favourites: data,
    isLoading,
    error,
    isError,
    isAuthenticated,
  };
};
