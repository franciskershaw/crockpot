import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createItemCategory } from "@/actions/item-categories";
import { queryKeys } from "@/lib/constants";
import { toast } from "sonner";

export function useCreateItemCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createItemCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.ITEMS] });
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error && error.message
          ? error.message
          : "Failed to create item category";
      toast.error(message);
    },
  });
}
