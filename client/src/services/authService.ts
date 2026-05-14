import { api } from "./api";

type LoginPayload = {
  email: string;
  password: string;
};

export async function login(payload: LoginPayload) {
  const response = await api.post("/auth/login", payload);

  return response.data;
}
