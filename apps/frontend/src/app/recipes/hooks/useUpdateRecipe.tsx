import { useRouter } from "next/navigation";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import useAxios from "@/hooks/axios/useAxios";
import useUser from "@/hooks/user/useUser";
import { queryKeys } from "@/lib/constants";
import type { Recipe } from "@/shared/types";

interface UpdateRecipeData {
  name?: string;
  timeInMinutes?: number;
  serves?: number;
  categoryIds?: string[];
  ingredients?: Array<{
    itemId: string;
    unitId: string | null;
    quantity: number;
  }>;
  instructions?: string[];
  notes?: string[];
  image?: {
    url: string;
    filename: string;
  } | null;
}

const useUpdateRecipe = () => {
  const api = useAxios();
  const { user } = useUser();
  const queryClient = useQueryClient();
  const router = useRouter();

  const updateRecipe = async ({
    recipeId,
    data,
  }: {
    recipeId: string;
    data: UpdateRecipeData;
  }): Promise<Recipe> => {
    const response = await api.patch(`/api/recipes/${recipeId}`, data, {
      headers: { Authorization: `Bearer ${user?.accessToken}` },
    });
    return response.data;
  };

  return useMutation({
    mutationFn: updateRecipe,
    onSuccess: (recipe) => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.RECIPES] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.USER_RECIPES] });

      toast.success("Recipe updated successfully!");

      // Redirect to the updated recipe page
      router.push(`/recipes/${recipe._id}`);
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to update recipe"
      );
    },
  });
};

export default useUpdateRecipe;
