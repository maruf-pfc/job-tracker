import { api } from "./api";
import type { ApiResponse } from "@/types/api";
import type { Lookup } from "@/types/lookup";

export async function getApplicationStatuses() {
  const response = await api.get<ApiResponse<Lookup[]>>("/applicationstatuses");

  return response.data.data;
}
