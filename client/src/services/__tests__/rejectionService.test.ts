import { describe, it, expect, vi } from "vitest";
import {
  upsertRetrospective,
  getRetrospective,
  getFailureAnalytics,
} from "../rejectionService";
import { api } from "../api";
import type { CreateRejectionRetrospectiveRequest } from "@/types/rejection";

vi.mock("../api", () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe("rejectionService", () => {
  it("upsertRetrospective should POST Google-Form-style diagnostic survey payload", async () => {
    const payload: CreateRejectionRetrospectiveRequest = {
      jobDomain: "Corporate",
      failedStage: "System Design Round",
      primaryRootCause: "Technical Depth & Core Concepts",
      preparationTime: "1-3 months",
      mockCount: "1-3 mocks",
      difficultyRating: 4,
      timePressureRating: 3,
      confidenceRating: 7,
      estimatedScore: 78,
      expectedCutoffScore: 85,
      technicalTopicGaps: ["System Design - Scalability & Partitioning"],
      behavioralFactors: ["Weak explanation of past projects"],
      externalBlockers: ["High competition / Extreme cutoff bar"],
      studyMaterialsUsed: ["Alex Xu System Design Vol 1 & 2"],
      specificWeaknessTags: ["System Design", "Scalability"],
      whatWentWell: "Coding round cleared",
      whatFailed: "Struggled with multi-region database failover",
      actionablePlan: "Read Alex Xu Vol 2",
    };

    const mockResponse = { id: "retro-1", ...payload };
    vi.mocked(api.post).mockResolvedValueOnce({ data: { data: mockResponse } });

    const result = await upsertRetrospective("app-123", payload);
    expect(result.id).toBe("retro-1");
    expect(result.difficultyRating).toBe(4);
    expect(result.preparationTime).toBe("1-3 months");
    expect(api.post).toHaveBeenCalledWith("/rejection-retrospectives/app-123", payload);
  });

  it("getRetrospective should GET retrospective by application ID", async () => {
    const mockRetro = {
      id: "retro-1",
      jobApplicationId: "app-123",
      jobDomain: "Govt & Bank",
      failedStage: "MCQ / Preliminary Test",
      primaryRootCause: "Exam Speed & Time Management",
      difficultyRating: 4,
      timePressureRating: 5,
      estimatedScore: 64.5,
      expectedCutoffScore: 72.0,
      negativeMarksLost: 6.0,
      specificWeaknessTags: ["MCQ Speed Drill"],
      technicalTopicGaps: ["Analytical Math & Shortcuts"],
    };

    vi.mocked(api.get).mockResolvedValueOnce({ data: { data: mockRetro } });

    const result = await getRetrospective("app-123");
    expect(result?.jobDomain).toBe("Govt & Bank");
    expect(result?.estimatedScore).toBe(64.5);
    expect(result?.negativeMarksLost).toBe(6.0);
    expect(api.get).toHaveBeenCalledWith("/rejection-retrospectives/app-123");
  });

  it("getFailureAnalytics should GET aggregated diagnostic survey statistics and remediation roadmap", async () => {
    const mockAnalytics = {
      totalRetrospectives: 2,
      corporateFailures: 1,
      govtFailures: 1,
      avgDifficultyRating: 4.0,
      avgTimePressureRating: 4.0,
      avgConfidenceRating: 5.5,
      avgCutoffDeficit: 7.5,
      stageBreakdown: [{ stage: "System Design Round", count: 1, percentage: 50 }],
      rootCauseBreakdown: [{ cause: "Technical Depth & Core Concepts", count: 1, percentage: 50 }],
      topTopicGaps: [{ topic: "System Design", count: 1, category: "Technical" }],
      topExternalBlockers: [{ topic: "Exam hall rush", count: 1, category: "External" }],
      preparationCorrelation: [{ prepDuration: "1-3 months", count: 1, avgConfidence: 6.0 }],
      remediationActionPlan: [
        {
          category: "Corporate Tech Architecture",
          title: "Distributed Systems & Scalability Frameworks",
          description: "Test description",
          recommendedAction: "Test action",
          priority: "High",
          tag: "System Design",
        },
      ],
    };

    vi.mocked(api.get).mockResolvedValueOnce({ data: { data: mockAnalytics } });

    const result = await getFailureAnalytics();
    expect(result.totalRetrospectives).toBe(2);
    expect(result.avgCutoffDeficit).toBe(7.5);
    expect(result.remediationActionPlan.length).toBe(1);
    expect(api.get).toHaveBeenCalledWith("/rejection-retrospectives/analytics");
  });
});
