export interface RejectionRetrospective {
  id: string;
  jobApplicationId: string;
  jobDomain: "Corporate" | "Govt & Bank";
  failedStage: string;
  primaryRootCause: string;
  specificWeaknessTags: string[];
  preparationTime?: string;
  mockCount?: string;
  difficultyRating?: number;
  timePressureRating?: number;
  confidenceRating?: number;
  estimatedScore?: number;
  expectedCutoffScore?: number;
  negativeMarksLost?: number;
  feedbackStatus?: string;
  technicalTopicGaps?: string[];
  behavioralFactors?: string[];
  externalBlockers?: string[];
  studyMaterialsUsed?: string[];
  whatWentWell?: string;
  whatFailed?: string;
  actionablePlan?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRejectionRetrospectiveRequest {
  jobDomain: "Corporate" | "Govt & Bank";
  failedStage: string;
  primaryRootCause: string;
  specificWeaknessTags: string[];
  preparationTime?: string;
  mockCount?: string;
  difficultyRating?: number;
  timePressureRating?: number;
  confidenceRating?: number;
  estimatedScore?: number;
  expectedCutoffScore?: number;
  negativeMarksLost?: number;
  feedbackStatus?: string;
  technicalTopicGaps?: string[];
  behavioralFactors?: string[];
  externalBlockers?: string[];
  studyMaterialsUsed?: string[];
  whatWentWell?: string;
  whatFailed?: string;
  actionablePlan?: string;
}

export interface StageFailureCount {
  stage: string;
  count: number;
  percentage: number;
}

export interface RootCauseCount {
  cause: string;
  count: number;
  percentage: number;
}

export interface TopicGapCount {
  topic: string;
  count: number;
  category: string;
}

export interface PrepCorrelation {
  prepDuration: string;
  count: number;
  avgConfidence: number;
}

export interface ActionableRemediationItem {
  category: string;
  title: string;
  description: string;
  recommendedAction: string;
  priority: "High" | "Medium";
  tag: string;
}

export interface FailureAnalytics {
  totalRetrospectives: number;
  corporateFailures: number;
  govtFailures: number;
  avgDifficultyRating: number;
  avgTimePressureRating: number;
  avgConfidenceRating: number;
  avgCutoffDeficit: number;
  stageBreakdown: StageFailureCount[];
  rootCauseBreakdown: RootCauseCount[];
  topTopicGaps: TopicGapCount[];
  topExternalBlockers: TopicGapCount[];
  preparationCorrelation: PrepCorrelation[];
  remediationActionPlan: ActionableRemediationItem[];
}
