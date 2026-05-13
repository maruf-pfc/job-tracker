import { api } from "./api";

import type { LoginRequest, RegisterRequest, AuthResponse } from "@/types/auth";

export async function login(payload: LoginRequest) {
  const response = await api.post<AuthResponse>("/auth/login", payload);

  return response.data;
}

export async function register(payload: RegisterRequest) {
  const response = await api.post<AuthResponse>("/auth/register", payload);

  return response.data;
}
