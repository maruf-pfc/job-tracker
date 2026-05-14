export type JobApplication = {
  id: string;
  role: string;
  location?: string;
  salaryRange?: string;
  appliedAt: string;
  isArchived: boolean;
  company: {
    id: string;
    name: string;
  };
  priority: {
    id: string;
    name: string;
  };
  applicationStatus: {
    id: string;
    name: string;
  };
  sourcePlatform: {
    id: string;
    name: string;
  };
  workType: {
    id: string;
    name: string;
  };
  jobType: {
    id: string;
    name: string;
  };
};
