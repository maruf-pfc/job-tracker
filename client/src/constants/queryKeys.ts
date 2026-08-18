export const QUERY_KEYS = {
  APPLICATIONS: ["applications"] as const,
  COMPANIES: ["companies"] as const,
  ROLES: ["job-roles"] as const,
  PROFILE: ["profile"] as const,
  DASHBOARD_SUMMARY: ["dashboard", "summary"] as const,
  DASHBOARD_STATUS_CHART: ["dashboard", "status-chart"] as const,
  DASHBOARD_PLATFORM_CHART: ["dashboard", "platform-chart"] as const,
  DASHBOARD_ANALYTICS: ["dashboard", "analytics"] as const,
  AI_ADVISOR: ["ai-advisor", "insights"] as const,
  LOOKUPS: {
    PRIORITIES: ["lookups", "priorities"] as const,
    JOB_TYPES: ["lookups", "job-types"] as const,
    WORK_TYPES: ["lookups", "work-types"] as const,
    SOURCE_PLATFORMS: ["lookups", "source-platforms"] as const,
    APPLICATION_STATUSES: ["lookups", "application-statuses"] as const,
  },
} as const;
