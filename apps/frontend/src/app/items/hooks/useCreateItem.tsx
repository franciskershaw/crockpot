import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import useAxios from "@/hooks/axios/useAxios";
import useUser from "@/hooks/user/useUser";
import { queryKeys } from "@/lib/constants";
import type { Item } from "@/shared/types";

interface CreateItemInput {
  name: string;
  categoryId: string;
  allowedUnitIds?: string[];
}

const useCreateItem = () => {
  const api = useAxios();
  const { user } = useUser();
  const queryClient = useQueryClient();

  const createItem = async (data: CreateItemInput): Promise<Item> => {
    const response = await api.post("/api/items", data, {
      headers: { Authorization: `Bearer ${user?.accessToken}` },
    });
    return response.data;
  };

  return useMutation({
    mutationFn: createItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.ITEMS] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.INGREDIENTS] });
      toast.success("Item created successfully");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to create item"
      );
    },
  });
};

export default useCreateItem;
