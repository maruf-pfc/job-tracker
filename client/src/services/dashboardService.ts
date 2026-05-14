import { api } from "./api";
import type { DashboardStats } from "@/types/dashboard";

export async function getDashboardStats() {
  const response = await api.get<DashboardStats>("/dashboard/stats");

  return response.data;
}

// import type { DashboardStats } from "@/types/dashboard";

// export async function getDashboardStats(): Promise<DashboardStats> {
//   return {
//     totalApplications: 24,
//     interviews: 6,
//     offers: 1,
//     rejected: 8,
//     responseRate: 25,
//   };
// }
