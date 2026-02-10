import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import useAxios from "@/hooks/axios/useAxios";
import useUser from "@/hooks/user/useUser";
import { queryKeys } from "@/lib/constants";

const useRemoveFromMenu = () => {
  const api = useAxios();
  const { user } = useUser();
  const queryClient = useQueryClient();

  const removeFromMenu = async ({ recipeId }: { recipeId: string }) => {
    const response = await api.delete("/api/menu", {
      data: { recipeId },
      headers: { Authorization: `Bearer ${user?.accessToken}` },
    });
    return response.data;
  };

  return useMutation({
    mutationFn: removeFromMenu,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.MENU] });
      toast.success("Recipe removed from menu");
    },
  });
};

export default useRemoveFromMenu;
