import { api } from "./api";
import type {
  RejectionRetrospective,
  CreateRejectionRetrospectiveRequest,
  FailureAnalytics,
} from "@/types/rejection";

export const upsertRetrospective = async (
  applicationId: string,
  data: CreateRejectionRetrospectiveRequest
): Promise<RejectionRetrospective> => {
  const res = await api.post(`/rejection-retrospectives/${applicationId}`, data);
  return res.data.data;
};

export const getRetrospective = async (
  applicationId: string
): Promise<RejectionRetrospective | null> => {
  const res = await api.get(`/rejection-retrospectives/${applicationId}`);
  return res.data.data;
};

export const getFailureAnalytics = async (): Promise<FailureAnalytics> => {
  const res = await api.get("/rejection-retrospectives/analytics");
  return res.data.data;
};
