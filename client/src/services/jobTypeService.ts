import { api } from "./api";
import type { ApiResponse } from "@/types/api";
import type { Lookup } from "@/types/lookup";

export async function getJobTypes() {
  const response = await api.get<ApiResponse<Lookup[]>>("/jobtypes");

  return response.data.data;
}
