import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import useAxios from "@/hooks/axios/useAxios";
import useUser from "@/hooks/user/useUser";
import { queryKeys } from "@/lib/constants";

const useRemoveFromFavourites = () => {
  const api = useAxios();
  const { user } = useUser();
  const queryClient = useQueryClient();

  const removeFromFavourites = async (recipeId: string) => {
    const response = await api.delete("/api/users/favourites", {
      data: { recipeId },
      headers: {
        Authorization: `Bearer ${user?.accessToken}`,
      },
    });
    return response.data;
  };

  return useMutation({
    mutationFn: removeFromFavourites,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.FAVOURITES] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export default useRemoveFromFavourites;
