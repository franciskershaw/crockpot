/**
 * Generic mutation hooks for common operations
 * Consolidates mutation patterns with toast notifications and query invalidation
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { UserRole, roleRank } from "@/data/types";

/**
 * Configuration for basic mutations
 */
interface BasicMutationConfig<TInput, TData> {
  mutationFn: (input: TInput) => Promise<TData>;
  invalidateQueries?: string[][];
  successMessage?: string | ((data: TData) => string);
  errorMessage?: string | ((error: Error) => string);
  onSuccess?: (data: TData, input: TInput) => void;
  onError?: (error: Error, input: TInput) => void;
  minimumRole: UserRole;
}

/**
 * Mutation hook with toast notifications and query invalidation
 */
export function useAuthenticatedMutation<TInput = unknown, TData = unknown>(
  config: BasicMutationConfig<TInput, TData>
) {
  const queryClient = useQueryClient();
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated" && !!session?.user;

  const hasRequiredRole = (): boolean => {
    // Strict: minimumRole is required; user must be logged in with a role
    if (!session?.user?.role) return false;
    const userRole = session.user.role as UserRole;
    return roleRank[userRole] >= roleRank[config.minimumRole];
  };

  return useMutation({
    mutationFn: config.mutationFn,
    onMutate: () => {
      // Enforce login for all mutations in this app
      if (!isAuthenticated) {
        throw new Error("Please sign in to continue");
      }

      // Enforce role-based access if specified
      if (!hasRequiredRole()) {
        throw new Error("You do not have permission to perform this action");
      }
    },
    onSuccess: (data, input) => {
      // Invalidate specified queries
      if (config.invalidateQueries) {
        config.invalidateQueries.forEach((queryKey) => {
          queryClient.invalidateQueries({
            queryKey,
            exact: false, // This allows partial matching for infinite queries
          });
        });
      }

      // Show success toast
      if (config.successMessage) {
        const message =
          typeof config.successMessage === "function"
            ? config.successMessage(data)
            : config.successMessage;
        toast.success(message);
      }

      // Call custom onSuccess handler
      config.onSuccess?.(data, input);
    },
    onError: (error: Error, input) => {
      // Show error toast
      const message = config.errorMessage
        ? typeof config.errorMessage === "function"
          ? config.errorMessage(error)
          : config.errorMessage
        : error.message || "Operation failed";

      toast.error(message);

      // Call custom onError handler
      config.onError?.(error, input);
    },
  });
}

/**
 * Add/Remove mutation pair factory
 * Creates consistent add and remove mutations for a resource
 */
export function createAddRemoveMutations<
  TAddInput,
  TRemoveInput,
  TAddData = unknown,
  TRemoveData = unknown
>(config: {
  addMutationFn: (input: TAddInput) => Promise<TAddData>;
  removeMutationFn: (input: TRemoveInput) => Promise<TRemoveData>;
  queryKey: string[];
  resourceName: string;
  additionalInvalidateQueries?: string[][];
  /** Minimum role required to perform these mutations (defaults to FREE). */
  minimumRole?: UserRole;
}) {
  const invalidateQueries = [
    config.queryKey,
    ...(config.additionalInvalidateQueries || []),
  ];

  const useAddMutation = () =>
    useAuthenticatedMutation<TAddInput, TAddData>({
      mutationFn: config.addMutationFn,
      invalidateQueries,
      successMessage: `${config.resourceName} added`,
      errorMessage: `Failed to add ${config.resourceName.toLowerCase()}`,
      minimumRole: config.minimumRole ?? UserRole.FREE,
    });

  const useRemoveMutation = () =>
    useAuthenticatedMutation<TRemoveInput, TRemoveData>({
      mutationFn: config.removeMutationFn,
      invalidateQueries,
      successMessage: `${config.resourceName} removed`,
      errorMessage: `Failed to remove ${config.resourceName.toLowerCase()}`,
      minimumRole: config.minimumRole ?? UserRole.FREE,
    });

  return {
    useAddMutation,
    useRemoveMutation,
  };
}
