import { api } from "./api";

export async function getDashboardSummary() {
  const response = await api.get("/dashboard/summary");

  return response.data;
}

export async function getStatusChart() {
  const response = await api.get("/dashboard/status-chart");

  return response.data;
}

export async function getPlatformChart() {
  const response = await api.get("/dashboard/platform-chart");

  return response.data;
}
