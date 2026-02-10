import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import useAxios from "@/hooks/axios/useAxios";
import useUser from "@/hooks/user/useUser";
import { queryKeys } from "@/lib/constants";

const useAddToFavourites = () => {
  const api = useAxios();
  const { user } = useUser();
  const queryClient = useQueryClient();

  const addToFavourites = async (recipeId: string) => {
    const response = await api.post(
      "/api/users/favourites",
      { recipeId },
      {
        headers: {
          Authorization: `Bearer ${user?.accessToken}`,
        },
      }
    );
    return response.data;
  };

  return useMutation({
    mutationFn: addToFavourites,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.FAVOURITES] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export default useAddToFavourites;
