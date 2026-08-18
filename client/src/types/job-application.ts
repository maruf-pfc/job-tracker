export type JobApplication = {
  id: string;
  company: string;
  role: string;
  jobUrl?: string;
  location?: string;
  salaryRange?: string;
  notes?: string;
  coverLetter?: string;
  resumeDriveLink?: string;
  appliedAt: string;
  followUpDate?: string;
  isArchived: boolean;
  priority: string;
  jobType: string;
  sourcePlatform: string;
  applicationStatus: string;
  workType: string;
  createdAt?: string;
  updatedAt?: string;
};

export type PaginatedResponse<T> = {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};

export type CreateJobApplicationRequest = {
  companyId: string;
  role: string;
  jobUrl?: string;
  location?: string;
  salaryRange?: string;
  notes?: string;
  resumeDriveLink?: string;
  priorityId: string;
  sourcePlatformId?: string;
  applicationStatusId: string;
  workTypeId: string;
  jobTypeId: string;
  appliedAt?: string;
  followUpDate?: string;
};

export type UpdateJobApplicationRequest = CreateJobApplicationRequest;
