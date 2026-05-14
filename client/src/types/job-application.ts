export type JobApplication = {
  id: string;
  role: string;
  companyName: string;
  location?: string;
  salaryRange?: string;
  appliedAt: string;
  followUpDate?: string;
  isArchived: boolean;
  priority: string;
  status: string;
  workType: string;
  sourcePlatform: string;
  jobType: string;
};
