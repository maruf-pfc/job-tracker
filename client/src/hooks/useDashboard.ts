import { useQuery } from "@tanstack/react-query";
import { getDashboardAnalytics, getDashboardSummary } from "@/services/dashboardService";
import { QUERY_KEYS } from "@/constants/queryKeys";

export function useDashboard() {
  const summaryQuery = useQuery({
    queryKey: QUERY_KEYS.DASHBOARD_SUMMARY,
    queryFn: getDashboardSummary,
  });

  const analyticsQuery = useQuery({
    queryKey: QUERY_KEYS.DASHBOARD_ANALYTICS,
    queryFn: getDashboardAnalytics,
  });

  return {
    summary: summaryQuery.data,
    analytics: analyticsQuery.data,
    isLoading: summaryQuery.isPending || analyticsQuery.isPending,
    isError: summaryQuery.isError || analyticsQuery.isError,
    error: summaryQuery.error || analyticsQuery.error,
    refetchSummary: summaryQuery.refetch,
    refetchAnalytics: analyticsQuery.refetch,
  };
}
