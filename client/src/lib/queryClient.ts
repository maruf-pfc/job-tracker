import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0, // Fresh queries immediately on mount and mutation
      gcTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});
