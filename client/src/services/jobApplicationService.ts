import { api } from "./api";
import type { JobApplication } from "@/types/job-application";

export async function getApplications() {
  const response = await api.get<JobApplication[]>("/jobapplications");

  return response.data;
}
