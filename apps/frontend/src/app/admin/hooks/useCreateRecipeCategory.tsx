"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRecipeCategory } from "@/actions/recipe-categories";
import { queryKeys } from "@/lib/constants";
import { toast } from "sonner";

export function useCreateRecipeCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRecipeCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.RECIPES] });
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error && error.message
          ? error.message
          : "Failed to create recipe category";
      toast.error(message);
    },
  });
}
