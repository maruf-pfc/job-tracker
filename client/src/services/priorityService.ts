import { api } from "./api";
import type { ApiResponse } from "@/types/api";
import type { Lookup } from "@/types/lookup";

export async function getPriorities() {
  const response = await api.get<ApiResponse<Lookup[]>>("/priorities");

  return response.data.data;
}
