import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteItemCategory } from "@/actions/item-categories";
import { queryKeys } from "@/lib/constants";
import { toast } from "sonner";

export function useDeleteItemCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteItemCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.ITEMS] });
      toast.success("Item category deleted");
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error && error.message
          ? error.message
          : "Failed to delete item category";
      toast.error(message);
    },
  });
}
