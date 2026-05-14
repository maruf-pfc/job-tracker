import { api } from "./api";
import type { ApiResponse } from "@/types/api";
import type { Company } from "@/types/company";

export async function getCompanies() {
  const response = await api.get<ApiResponse<Company[]>>("/companies");

  return response.data.data;
}
