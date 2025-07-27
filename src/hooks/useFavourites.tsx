import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addRecipeToFavourites,
  getUserFavourites,
  removeRecipeFromFavourites,
} from "@/actions/favourites";
import { toast } from "sonner";

export const useAddToFavouritesMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addRecipeToFavourites,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favourites"] });
      toast.success("Recipe added to favourites");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add recipe to favourites");
    },
  });
};

export const useRemoveFromFavouritesMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeRecipeFromFavourites,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favourites"] });
      toast.success("Recipe removed from favourites");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to remove recipe from favourites");
    },
  });
};

export const useGetFavourites = () => {
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["favourites"],
    queryFn: getUserFavourites,
  });

  return {
    favourites: data,
    isLoading,
    error,
    isError,
  };
};
