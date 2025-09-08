/**
 * Optimistic mutation hook for complex state updates
 * Consolidates the optimistic update pattern used in shopping list mutations
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { UserRole, roleRank } from "@/data/types";

/**
 * Configuration for optimistic mutations
 */
interface OptimisticMutationConfig<TInput, TData, TQueryData> {
  mutationFn: (input: TInput) => Promise<TData>;
  queryKey: string[];
  optimisticUpdate: (
    previous: TQueryData | undefined,
    input: TInput
  ) => TQueryData | undefined;
  successMessage?: string;
  errorMessage?: string;
  onSuccess?: (data: TData, input: TInput) => void;
  /** Minimum role required to perform this optimistic mutation */
  minimumRole: UserRole;
}

/**
 * Optimistic mutation hook with automatic rollback on error
 */
export function useOptimisticMutation<TInput, TData, TQueryData>(
  config: OptimisticMutationConfig<TInput, TData, TQueryData>
) {
  const queryClient = useQueryClient();
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated" && !!session?.user;
  const hasRequiredRole = (): boolean => {
    if (!session?.user?.role) return false;
    const userRole = session.user.role as UserRole;
    return roleRank[userRole] >= roleRank[config.minimumRole];
  };

  return useMutation({
    mutationFn: config.mutationFn,
    onMutate: async (input: TInput) => {
      // Enforce login for all mutations and role-based access
      if (!isAuthenticated) {
        throw new Error("Please sign in to continue");
      }
      if (!hasRequiredRole()) {
        throw new Error("You do not have permission to perform this action");
      }

      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: config.queryKey });

      // Get previous data
      const previous = queryClient.getQueryData<TQueryData>(config.queryKey);

      // Apply optimistic update
      const optimisticData = config.optimisticUpdate(previous, input);
      if (optimisticData !== undefined) {
        queryClient.setQueryData(config.queryKey, optimisticData);
      }

      return { previous };
    },
    onError: (error: Error, input, context) => {
      // Rollback on error
      if (context?.previous !== undefined) {
        queryClient.setQueryData(config.queryKey, context.previous);
      }

      // Show error toast
      const message =
        config.errorMessage || error.message || "Operation failed";
      toast.error(message);
    },
    onSuccess: (data, input) => {
      // Show success toast if configured
      if (config.successMessage) {
        toast.success(config.successMessage);
      }

      // Call custom onSuccess handler
      config.onSuccess?.(data, input);
    },
    onSettled: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: config.queryKey });
    },
  });
}
