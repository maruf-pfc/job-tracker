import { api } from "./api";
import type { AiCareerInsight } from "../types/ai-advisor";

export const aiAdvisorService = {
  async getCareerInsights(forceRefresh: boolean = false): Promise<AiCareerInsight> {
    const response = await api.get<AiCareerInsight>("/aiadvisor/insights", {
      params: { forceRefresh },
    });
    return response.data;
  },

  async refreshCareerInsights(): Promise<AiCareerInsight> {
    const response = await api.post<AiCareerInsight>("/aiadvisor/insights/refresh");
    return response.data;
  },
};
