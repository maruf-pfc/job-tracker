import { api } from "./api";
import type { ApiResponse } from "@/types/api";

import type {
  JobApplication,
  PaginatedResponse,
  CreateJobApplicationRequest,
  UpdateJobApplicationRequest,
} from "@/types/job-application";

export async function getApplications() {
  const response =
    await api.get<ApiResponse<PaginatedResponse<JobApplication>>>(
      "/jobapplications",
    );

  return response.data.data;
}

export async function createApplication(data: CreateJobApplicationRequest) {
  const response = await api.post<ApiResponse<JobApplication>>(
    "/jobapplications",
    data,
  );

  return response.data.data;
}

export async function deleteApplication(id: string) {
  await api.delete(`/jobapplications/${id}`);
}

export async function updateApplication(
  id: string,
  data: UpdateJobApplicationRequest,
) {
  const response = await api.put<ApiResponse<JobApplication>>(
    `/jobapplications/${id}`,
    data,
  );

  return response.data.data;
}
