import { api } from "./api";
import type { UserProfile } from "@/types/profile";

export const getProfile = async (): Promise<UserProfile> => {
  const response = await api.get("/profile");
  return response.data.data;
};

export const updateProfile = async (profile: UserProfile): Promise<UserProfile> => {
  const payload: UserProfile = {
    ...profile,
    dateOfBirth: profile.dateOfBirth && profile.dateOfBirth.trim() !== "" ? profile.dateOfBirth.trim() : undefined,
  };
  const response = await api.put("/profile", payload);
  return response.data.data;
};

