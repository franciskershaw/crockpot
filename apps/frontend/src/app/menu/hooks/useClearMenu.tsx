import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import useAxios from "@/hooks/axios/useAxios";
import useUser from "@/hooks/user/useUser";
import { queryKeys } from "@/lib/constants";

const useClearMenu = () => {
  const api = useAxios();
  const { user } = useUser();
  const queryClient = useQueryClient();

  const clearMenu = async () => {
    const response = await api.delete("/api/menu/clear", {
      headers: { Authorization: `Bearer ${user?.accessToken}` },
    });
    return response.data;
  };

  return useMutation({
    mutationFn: clearMenu,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.MENU] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.SHOPPING_LIST] });
      toast.success("Menu cleared successfully");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to clear menu"
      );
    },
  });
};

export default useClearMenu;
