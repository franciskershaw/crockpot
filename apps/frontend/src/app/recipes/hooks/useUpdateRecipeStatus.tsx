import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import useAxios from "@/hooks/axios/useAxios";
import useUser from "@/hooks/user/useUser";
import { queryKeys } from "@/lib/constants";

interface UpdateRecipeStatusData {
  approved: boolean;
}

interface RecipeStatusResponse {
  _id: string;
  name: string;
  approved: boolean;
}

const useUpdateRecipeStatus = () => {
  const api = useAxios();
  const { user } = useUser();
  const queryClient = useQueryClient();

  const updateRecipeStatus = async ({
    recipeId,
    approved,
  }: {
    recipeId: string;
    approved: boolean;
  }): Promise<RecipeStatusResponse> => {
    const response = await api.patch(
      `/api/recipes/${recipeId}/status`,
      { approved },
      {
        headers: { Authorization: `Bearer ${user?.accessToken}` },
      }
    );
    return response.data;
  };

  return useMutation({
    mutationFn: updateRecipeStatus,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.RECIPES] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.USER_RECIPES] });

      toast.success(
        `Recipe ${data.approved ? "approved" : "rejected"} successfully!`
      );
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update recipe status"
      );
    },
  });
};

export default useUpdateRecipeStatus;
