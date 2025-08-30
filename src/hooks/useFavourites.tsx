import {
  addRecipeToFavourites,
  getUserFavourites,
  removeRecipeFromFavourites,
} from "@/actions/favourites";
import { useAuthenticatedQuery } from "./shared/useAuthenticatedQuery";
import { createAddRemoveMutations } from "./shared/useBasicMutation";
import queryKeys from "@/lib/constants";

// Create add/remove mutations using the factory
const { useAddMutation, useRemoveMutation } = createAddRemoveMutations({
  addMutationFn: addRecipeToFavourites,
  removeMutationFn: removeRecipeFromFavourites,
  queryKey: [queryKeys.FAVOURITES],
  resourceName: "Recipe to favourites",
  requireAuth: true, // Enable authentication checks
});

export const useAddToFavouritesMutation = useAddMutation;
export const useRemoveFromFavouritesMutation = useRemoveMutation;

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
