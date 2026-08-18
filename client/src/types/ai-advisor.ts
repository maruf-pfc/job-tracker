export interface AiActionItem {
  title: string;
  description: string;
  priority: "High" | "Medium" | "Low" | string;
  category: string;
}

export interface AiCareerInsight {
  executiveSummary: string;
  govtVsCorporateStrategy: string;
  keyStrengths: string[];
  criticalGaps: string[];
  actionPlan: AiActionItem[];
  isCached: boolean;
  generatedAt: string;
  totalApplicationsAnalyzed: number;
}
