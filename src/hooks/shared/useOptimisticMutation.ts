/**
 * Optimistic mutation hook for complex state updates
 * Consolidates the optimistic update pattern used in shopping list mutations
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

/**
 * Configuration for optimistic mutations
 */
interface OptimisticMutationConfig<TInput, TData, TQueryData> {
  mutationFn: (input: TInput) => Promise<TData>;
  queryKey: string[];
  optimisticUpdate: (previous: TQueryData | undefined, input: TInput) => TQueryData | undefined;
  successMessage?: string;
  errorMessage?: string;
  onSuccess?: (data: TData, input: TInput) => void;
  requireAuth?: boolean; // New optional authentication flag
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

  return useMutation({
    mutationFn: config.mutationFn,
    onMutate: async (input: TInput) => {
      // Check authentication before allowing mutation
      if (config.requireAuth && !isAuthenticated) {
        throw new Error("Please sign in to continue");
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
      const message = config.errorMessage || error.message || "Operation failed";
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

/**
 * Shopping list item type for optimistic updates
 */
interface ShoppingListItem {
  itemId: string;
  unitId: string | null;
  quantity: number;
  obtained: boolean;
  isManual?: boolean;
  // Allow additional properties
  [key: string]: unknown;
}

interface ShoppingListData {
  items: ShoppingListItem[];
  // Allow additional properties
  [key: string]: unknown;
}

/**
 * Factory for creating shopping list style optimistic mutations
 */
export function createShoppingListMutation<TInput>(config: {
  mutationFn: (input: TInput) => Promise<unknown>;
  itemMatcher: (item: ShoppingListItem, input: TInput) => boolean;
  itemUpdater: (item: ShoppingListItem, input: TInput) => ShoppingListItem;
  successMessage?: string;
  errorMessage?: string;
  requireAuth?: boolean; // Add authentication flag
}) {
  return () => useOptimisticMutation<TInput, unknown, ShoppingListData>({
    mutationFn: config.mutationFn,
    queryKey: ["shopping-list"],
    optimisticUpdate: (previous, input) => {
      if (!previous) return previous;
      
      return {
        ...previous,
        items: previous.items.map((item: ShoppingListItem) =>
          config.itemMatcher(item, input)
            ? config.itemUpdater(item, input)
            : item
        ),
      };
    },
    successMessage: config.successMessage,
    errorMessage: config.errorMessage,
    requireAuth: config.requireAuth,
  });
}

/**
 * Factory for creating shopping list removal mutations
 */
export function createShoppingListRemovalMutation<TInput>(config: {
  mutationFn: (input: TInput) => Promise<unknown>;
  itemMatcher: (item: ShoppingListItem, input: TInput) => boolean;
  successMessage?: string;
  errorMessage?: string;
  requireAuth?: boolean; // Add authentication flag
}) {
  return () => useOptimisticMutation<TInput, unknown, ShoppingListData>({
    mutationFn: config.mutationFn,
    queryKey: ["shopping-list"],
    optimisticUpdate: (previous, input) => {
      if (!previous) return previous;
      
      return {
        ...previous,
        items: previous.items.filter((item: ShoppingListItem) => !config.itemMatcher(item, input)),
      };
    },
    successMessage: config.successMessage,
    errorMessage: config.errorMessage,
    requireAuth: config.requireAuth,
  });
}
