import { api } from "./api";
import type { ApiResponse } from "@/types/api";
import type { DashboardSummary } from "@/types/dashboard";

export type WeeklyTrend = {
  weekLabel: string;
  applicationCount: number;
};

export type DashboardAnalytics = {
  responseRatePercentage: number;
  interviewConversionRatePercentage: number;
  totalApplications: number;
  totalInterviews: number;
  totalOffers: number;
  weeklyTrends: WeeklyTrend[];
};

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const response = await api.get<ApiResponse<DashboardSummary>>("/dashboard/summary");
  return response.data.data;
}

export async function getDashboardAnalytics(): Promise<DashboardAnalytics> {
  const response = await api.get<ApiResponse<DashboardAnalytics>>("/dashboard/analytics");
  return response.data.data;
}
