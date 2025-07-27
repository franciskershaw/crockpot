// For use in client components that need to mutate the menu

import {
  addRecipeToMenu,
  removeRecipeFromMenu,
  getUserMenu,
} from "@/actions/menu";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface SerializedError {
  message?: string;
  code?: string;
}

export const useAddToMenuMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addRecipeToMenu,
    onSuccess: (data, variables) => {
      console.log("data", data);
      console.log("variables", variables);
      queryClient.invalidateQueries({ queryKey: ["menu"] });
      toast.success("Recipe added to menu!");
    },
    onError: (error: SerializedError) => {
      toast.error(error.message || "Failed to add recipe to menu");
    },
  });
};

export const useRemoveFromMenuMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeRecipeFromMenu,
    onSuccess: () => {
      toast.success("Recipe removed from menu");
      queryClient.invalidateQueries({ queryKey: ["menu"] });
    },
    onError: (error: SerializedError) => {
      toast.error(error.message || "Failed to remove recipe from menu");
    },
  });
};

export const useGetMenu = () => {
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["menu"],
    queryFn: getUserMenu,
  });

  return {
    menu: data,
    isLoading,
    error,
    isError,
  };
};
