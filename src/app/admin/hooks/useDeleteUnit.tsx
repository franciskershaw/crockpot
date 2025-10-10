"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUnit } from "@/actions/units";
import { queryKeys } from "@/lib/constants";
import { toast } from "sonner";

export function useDeleteUnit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUnit,
    onSuccess: () => {
      // Invalidate units queries
      queryClient.invalidateQueries({
        queryKey: [queryKeys.UNITS],
        exact: false,
      });
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error && error.message
          ? error.message
          : "Failed to delete unit";
      toast.error(message);
    },
  });
}
