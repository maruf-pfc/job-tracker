import { z } from "zod";

export const createJobApplicationSchema = z.object({
  companyId: z.string().min(1, "Company is required"),
  role: z.string().min(1, "Role is required"),
  jobUrl: z.string().optional(),
  location: z.string().optional(),
  salaryRange: z.string().optional(),
  notes: z.string().optional(),
  resumeDriveLink: z.string().optional(),
  priorityId: z.string().min(1, "Priority is required"),
  sourcePlatformId: z.string().optional(),
  applicationStatusId: z.string().min(1, "Status is required"),
  workTypeId: z.string().min(1, "Work type is required"),
  jobTypeId: z.string().min(1, "Job type is required"),
});
