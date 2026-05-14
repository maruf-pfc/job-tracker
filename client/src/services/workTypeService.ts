import { api } from "./api";
import type { ApiResponse } from "@/types/api";
import type { Lookup } from "@/types/lookup";

export async function getWorkTypes() {
  const response = await api.get<ApiResponse<Lookup[]>>("/worktypes");

  return response.data.data;
}
