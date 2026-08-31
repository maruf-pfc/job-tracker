import { api } from "./api";
import type { ApiResponse } from "@/types/api";
import type { Lookup } from "@/types/lookup";

export async function getSourcePlatforms() {
  const response = await api.get<ApiResponse<Lookup[]>>("/source-platforms");

  return response.data.data;
}
