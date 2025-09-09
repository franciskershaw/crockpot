"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRecipeCategory } from "@/actions/recipe-categories";
import { queryKeys } from "@/lib/constants";
import { toast } from "sonner";

export function useDeleteRecipeCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRecipeCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.RECIPES] });
      toast.success("Recipe category deleted");
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error && error.message
          ? error.message
          : "Failed to delete recipe category";
      toast.error(message);
    },
  });
}


