import { useRouter } from "next/navigation";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import useAxios from "@/hooks/axios/useAxios";
import useUser from "@/hooks/user/useUser";
import { queryKeys } from "@/lib/constants";
import type { Recipe } from "@/shared/types";

const useDeleteRecipe = () => {
  const api = useAxios();
  const { user } = useUser();
  const queryClient = useQueryClient();
  const router = useRouter();

  const deleteRecipe = async (recipeId: string): Promise<Recipe> => {
    const response = await api.delete(`/api/recipes/${recipeId}`, {
      headers: { Authorization: `Bearer ${user?.accessToken}` },
    });
    return response.data;
  };

  return useMutation({
    mutationFn: deleteRecipe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.RECIPES] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.USER_RECIPES] });

      toast.success("Recipe deleted successfully!");

      // Redirect to recipes page
      router.push("/recipes");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete recipe"
      );
    },
  });
};

export default useDeleteRecipe;
