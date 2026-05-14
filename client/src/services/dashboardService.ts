import { api } from "./api";

import type { ApiResponse } from "@/types/api";

import type { DashboardSummary } from "@/types/dashboard";

export async function getDashboardSummary() {
  const response =
    await api.get<ApiResponse<DashboardSummary>>("/dashboard/summary");

  return response.data.data;
}
