import { z } from "zod";

export const createJobApplicationSchema = z.object({
  companyId: z.string().min(1),
  role: z.string().min(2, "Role is required"),
  location: z.string().optional(),
  salaryRange: z.string().optional(),
  notes: z.string().optional(),
  resumeDriveLink: z.string().optional(),
  priorityId: z.string().min(1),
  sourcePlatformId: z.string().min(1),
  applicationStatusId: z.string().min(1),
  workTypeId: z.string().min(1),
  jobTypeId: z.string().min(1),
});
