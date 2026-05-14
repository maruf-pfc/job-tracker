import { api } from "./api";
import type { ApiResponse } from "@/types/api";
import type { AuthResponse, LoginRequest, RegisterRequest } from "@/types/auth";

export async function login(payload: LoginRequest) {
  const response = await api.post<ApiResponse<AuthResponse>>(
    "/auth/login",
    payload,
  );

  return response.data.data;
}

export async function register(payload: RegisterRequest) {
  const response = await api.post<ApiResponse<AuthResponse>>(
    "/auth/register",
    payload,
  );

  return response.data.data;
}
