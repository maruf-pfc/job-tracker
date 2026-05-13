import { apiClient } from "@/lib/api-client";

import type { AuthResponse, LoginRequest, RegisterRequest } from "@/types/auth";

export async function login(payload: LoginRequest) {
  const response = await apiClient.post<AuthResponse>("/auth/login", payload);

  return response.data;
}

export async function register(payload: RegisterRequest) {
  const response = await apiClient.post<AuthResponse>(
    "/auth/register",
    payload,
  );

  return response.data;
}
