import { api } from "./api";
import type { ApiResponse } from "@/types/api";
import type { JobApplication } from "@/types/job-application";

export async function getApplications() {
  const response =
    await api.get<ApiResponse<JobApplication[]>>("/jobapplications");

  return response.data.data;
}
