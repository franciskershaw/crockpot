"use client";
import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export default function QueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            refetchOnMount: false, // Don't refetch on mount if data exists
            refetchOnReconnect: false, // Don't refetch on reconnect
            staleTime: 10 * 60 * 1000, // 10 minutes - more aggressive
            gcTime: 15 * 60 * 1000, // 15 minutes
            retry: 1, // Only retry once
            retryDelay: 1000, // Wait 1 second before retry
          },
          mutations: {
            retry: 1,
            retryDelay: 1000,
          },
        },
      })
  );
  return (
    <QueryClientProvider client={client}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
