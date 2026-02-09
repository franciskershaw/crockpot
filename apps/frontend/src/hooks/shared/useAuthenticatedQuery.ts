/**
 * Generic authenticated data fetching hook
 * Consolidates the authentication check and query pattern used across multiple hooks
 */

import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import useUser from "@/hooks/user/useUser";

/**
 * Hook for authenticated data fetching with consistent patterns
 */
export function useAuthenticatedQuery<TData = unknown, TError = Error>(
  queryKey: string[],
  queryFn: () => Promise<TData>,
  options?: Omit<
    UseQueryOptions<TData, TError>,
    "queryKey" | "queryFn" | "enabled"
  >
) {
  const { user } = useUser();
  const isAuthenticated = !!user;

  const query = useQuery<TData, TError>({
    queryKey,
    queryFn,
    enabled: isAuthenticated,
    ...options,
  });

  return {
    ...query,
    isAuthenticated,
  };
}

/**
 * Hook for non-authenticated data fetching (public data)
 */
export function usePublicQuery<TData = unknown, TError = Error>(
  queryKey: string[],
  queryFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">
) {
  const query = useQuery<TData, TError>({
    queryKey,
    queryFn,
    ...options,
  });

  return query;
}
