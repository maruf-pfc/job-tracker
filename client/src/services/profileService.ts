import { api } from "./api";

export type UserProfile = {
  id?: string;
  userId?: string;
  nameEnglish: string;
  nameBangla?: string;
  fatherName?: string;
  motherName?: string;
  dateOfBirth?: string;
  nationality?: string;
  religion?: string;
  gender?: string;
  birthRegistration?: string;
  nationalId?: string;
  maritalStatus?: string;
  mobileNumber?: string;
  email?: string;
  presentAddress?: string;
  permanentAddress?: string;
  bioSummary?: string;
  educationDetailsJson?: string;
  codingProfilesJson?: string;
};

export const getProfile = async (): Promise<UserProfile> => {
  const response = await api.get("/profile");
  return response.data.data;
};

export const updateProfile = async (profile: UserProfile): Promise<UserProfile> => {
  const response = await api.put("/profile", profile);
  return response.data.data;
};
