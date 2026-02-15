import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import useAxios from "@/hooks/axios/useAxios";
import useUser from "@/hooks/user/useUser";
import { queryKeys } from "@/lib/constants";
import type { Item } from "@/shared/types";

const useDeleteItem = () => {
  const api = useAxios();
  const { user } = useUser();
  const queryClient = useQueryClient();

  const deleteItem = async (itemId: string): Promise<Item> => {
    const response = await api.delete(`/api/items/${itemId}`, {
      headers: { Authorization: `Bearer ${user?.accessToken}` },
    });
    return response.data;
  };

  return useMutation({
    mutationFn: deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.ITEMS] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.INGREDIENTS] });
      toast.success("Item deleted successfully");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete item"
      );
    },
  });
};

export default useDeleteItem;
