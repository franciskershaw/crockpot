import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import useAxios from "@/hooks/axios/useAxios";
import useUser from "@/hooks/user/useUser";
import { queryKeys } from "@/lib/constants";

const useAddToMenu = () => {
  const api = useAxios();
  const { user } = useUser();
  const queryClient = useQueryClient();

  const addToMenu = async ({
    recipeId,
    serves,
  }: {
    recipeId: string;
    serves: number;
  }) => {
    const response = await api.post(
      "/api/menu",
      { recipeId, serves },
      { headers: { Authorization: `Bearer ${user?.accessToken}` } }
    );
    return response.data;
  };

  return useMutation({
    mutationFn: addToMenu,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.MENU] });
      toast.success("Recipe added to menu");
    },
  });
};

export default useAddToMenu;
