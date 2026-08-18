import { api } from "./api";
import type { UserProfile } from "@/types/profile";

export const getProfile = async (): Promise<UserProfile> => {
  const response = await api.get("/profile");
  return response.data.data;
};

export const updateProfile = async (profile: UserProfile): Promise<UserProfile> => {
  const response = await api.put("/profile", profile);
  return response.data.data;
};
