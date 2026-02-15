import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import useAxios from "@/hooks/axios/useAxios";
import useUser from "@/hooks/user/useUser";
import { queryKeys } from "@/lib/constants";
import type { Item } from "@/shared/types";

interface UpdateItemInput {
  name?: string;
  categoryId?: string;
  allowedUnitIds?: string[];
}

const useUpdateItem = () => {
  const api = useAxios();
  const { user } = useUser();
  const queryClient = useQueryClient();

  const updateItem = async ({
    itemId,
    data,
  }: {
    itemId: string;
    data: UpdateItemInput;
  }): Promise<Item> => {
    const response = await api.patch(`/api/items/${itemId}`, data, {
      headers: { Authorization: `Bearer ${user?.accessToken}` },
    });
    return response.data;
  };

  return useMutation({
    mutationFn: updateItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.ITEMS] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.INGREDIENTS] });
      toast.success("Item updated successfully");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to update item"
      );
    },
  });
};

export default useUpdateItem;
