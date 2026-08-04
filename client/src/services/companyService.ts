import { api } from "./api";
import type { ApiResponse } from "@/types/api";
import type { Company, CreateCompanyRequest } from "@/types/company";

export async function getCompanies(): Promise<Company[]> {
  const response = await api.get<ApiResponse<Company[]>>("/companies");
  return response.data.data;
}

export async function createCompany(data: CreateCompanyRequest): Promise<Company> {
  const response = await api.post<ApiResponse<Company>>("/companies", data);
  return response.data.data;
}

export async function updateCompany(id: string, data: CreateCompanyRequest): Promise<Company> {
  const response = await api.put<ApiResponse<Company>>(`/companies/${id}`, data);
  return response.data.data;
}

export async function deleteCompany(id: string): Promise<void> {
  await api.delete(`/companies/${id}`);
}
