/**
 * Generic authenticated data fetching hook
 * Consolidates the authentication check and query pattern used across multiple hooks
 */

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

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
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated" && !!session?.user;

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
