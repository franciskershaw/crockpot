import { useRouter } from "next/navigation";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import useAxios from "@/hooks/axios/useAxios";
import useUser from "@/hooks/user/useUser";
import { queryKeys } from "@/lib/constants";
import type { Recipe } from "@/shared/types";

interface CreateRecipeData {
  name: string;
  timeInMinutes: number;
  serves: number;
  categoryIds: string[];
  ingredients: Array<{
    itemId: string;
    unitId: string | null;
    quantity: number;
  }>;
  instructions: string[];
  notes?: string[];
  image?: {
    url: string;
    filename: string;
  } | null;
}

const useCreateRecipe = () => {
  const api = useAxios();
  const { user } = useUser();
  const queryClient = useQueryClient();
  const router = useRouter();

  const createRecipe = async (data: CreateRecipeData): Promise<Recipe> => {
    const response = await api.post("/api/recipes", data, {
      headers: { Authorization: `Bearer ${user?.accessToken}` },
    });
    return response.data;
  };

  return useMutation({
    mutationFn: createRecipe,
    onSuccess: (recipe) => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.RECIPES] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.USER_RECIPES] });

      const isApproved = recipe.approved;
      toast.success(
        isApproved
          ? "Recipe created successfully!"
          : "Recipe created and is pending approval"
      );

      // Redirect to the new recipe page
      router.push(`/recipes/${recipe._id}`);
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to create recipe"
      );
    },
  });
};

export default useCreateRecipe;
