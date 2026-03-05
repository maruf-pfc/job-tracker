import { z } from "zod";

export const jobCreateSchema = z.object({
  company_name: z.string().min(1),
  company_linkedin: z.string().url().optional().nullable(),
  company_fb: z.string().url().optional().nullable(),
  company_other: z.string().optional().nullable(),
  role: z.string().min(1),
  salary: z.string().optional().nullable(),
  post_link: z.string().url().optional().nullable(),
  last_date: z.string().optional().nullable(), // ISO date
  applied: z.boolean().default(false),
  cv_link: z.string().url().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const jobUpdateSchema = jobCreateSchema
  .partial()
  .extend({ id: z.string().uuid() });
