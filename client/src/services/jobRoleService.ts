import { api } from "./api";
import type { ApiResponse } from "@/types/api";

export type JobRole = {
  id: string;
  name: string;
};

export type CreateJobRoleRequest = {
  name: string;
};

export async function getJobRoles(): Promise<JobRole[]> {
  const response = await api.get<ApiResponse<JobRole[]>>("/job-roles");
  return response.data.data;
}

export async function createJobRole(data: CreateJobRoleRequest): Promise<JobRole> {
  const response = await api.post<ApiResponse<JobRole>>("/job-roles", data);
  return response.data.data;
}

export async function updateJobRole(id: string, data: CreateJobRoleRequest): Promise<JobRole> {
  const response = await api.put<ApiResponse<JobRole>>(`/job-roles/${id}`, data);
  return response.data.data;
}

export async function deleteJobRole(id: string): Promise<void> {
  await api.delete(`/job-roles/${id}`);
}
