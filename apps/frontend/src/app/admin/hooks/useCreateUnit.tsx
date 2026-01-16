"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUnit } from "@/actions/units";
import { queryKeys } from "@/lib/constants";

export function useCreateUnit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUnit,
    onSuccess: () => {
      // Invalidate units queries
      queryClient.invalidateQueries({
        queryKey: [queryKeys.UNITS],
        exact: false,
      });
    },
  });
}
