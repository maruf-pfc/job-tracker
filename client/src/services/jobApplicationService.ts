import { api } from "./api";
import type { ApiResponse } from "@/types/api";

import type {
  JobApplication,
  PaginatedResponse,
  CreateJobApplicationRequest,
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
