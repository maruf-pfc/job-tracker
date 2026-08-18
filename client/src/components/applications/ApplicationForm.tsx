import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { getCompanies } from "@/services/companyService";
import { getJobRoles } from "@/services/jobRoleService";
import { getPriorities } from "@/services/priorityService";
import { getApplicationStatuses } from "@/services/applicationStatusService";
import { getSourcePlatforms } from "@/services/sourcePlatformService";
import { getJobTypes } from "@/services/jobTypeService";
import { getWorkTypes } from "@/services/workTypeService";
import {
  createApplication,
  updateApplication,
} from "@/services/jobApplicationService";
import { createJobApplicationSchema } from "@/schemas/jobApplicationSchema";
import type { CreateJobApplicationRequest } from "@/types/job-application";
import ApplicationFormSection from "./ApplicationFormSection";
import type { JobApplication } from "@/types/job-application";

type Props = {
  onSuccess: () => void;
  initialData?: JobApplication | null;
};

export default function ApplicationForm({ onSuccess, initialData }: Props) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CreateJobApplicationRequest>({
    resolver: zodResolver(createJobApplicationSchema),
  });

  const selectedJobTypeId = useWatch({ control, name: "jobTypeId" });

  const { data: companies } = useQuery({
    queryKey: ["companies"],
    queryFn: getCompanies,
  });

  const { data: jobRoles } = useQuery({
    queryKey: ["job-roles"],
    queryFn: getJobRoles,
  });

  const { data: priorities } = useQuery({
    queryKey: ["priorities"],
    queryFn: getPriorities,
  });

  const { data: statuses } = useQuery({
    queryKey: ["statuses"],
    queryFn: getApplicationStatuses,
  });

  const { data: platforms } = useQuery({
    queryKey: ["platforms"],
    queryFn: getSourcePlatforms,
  });

  const { data: workTypes } = useQuery({
    queryKey: ["work-types"],
    queryFn: getWorkTypes,
  });

  const { data: jobTypes } = useQuery({
    queryKey: ["job-types"],
    queryFn: getJobTypes,
  });

  const selectedJobType = jobTypes?.find((j) => j.id === selectedJobTypeId);
  const isGovtOrBank =
    selectedJobType?.name.toLowerCase().includes("govt") ||
    selectedJobType?.name.toLowerCase().includes("bank") ||
    selectedJobType?.name.toLowerCase().includes("cadre");

  useEffect(() => {
    if (!initialData) {
      return;
    }

    const targetCompanyId = companies?.find((c) => c.name === initialData.company)?.id || "";
    const targetPriorityId = priorities?.find((p) => p.name === initialData.priority)?.id || "";
    const targetStatusId = statuses?.find((s) => s.name === initialData.applicationStatus)?.id || "";
    const targetWorkTypeId = workTypes?.find((w) => w.name === initialData.workType)?.id || "";
    const targetJobTypeId = jobTypes?.find((j) => j.name === initialData.jobType)?.id || "";
    const targetPlatformId = platforms?.find((p) => p.name === initialData.sourcePlatform)?.id || "";

    reset({
      companyId: targetCompanyId,
      role: initialData.role || "",
      jobUrl: initialData.jobUrl || "",
      location: initialData.location || "",
      salaryRange: initialData.salaryRange || "",
      notes: initialData.notes || "",
      resumeDriveLink: initialData.resumeDriveLink || "",
      priorityId: targetPriorityId,
      sourcePlatformId: targetPlatformId,
      applicationStatusId: targetStatusId,
      workTypeId: targetWorkTypeId,
      jobTypeId: targetJobTypeId,
    });
  }, [initialData, reset, companies, jobRoles, priorities, statuses, workTypes, jobTypes, platforms]);

  const mutation = useMutation({
    mutationFn: (data: CreateJobApplicationRequest) => {
      const payload = {
        ...data,
        sourcePlatformId: data.sourcePlatformId || platforms?.[0]?.id || "",
      };

      if (initialData) {
        return updateApplication(initialData.id, payload);
      }

      return createApplication(payload);
    },
    onSuccess: async () => {
      toast.success(
        initialData
          ? "Application updated successfully"
          : "Application created successfully",
      );
      await queryClient.invalidateQueries({ queryKey: ["applications"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard-analytics"] });
      onSuccess();
    },
    onError: (err: unknown) => {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      toast.error(
        axiosErr.response?.data?.message ||
        (initialData
          ? "Failed to update application"
          : "Failed to create application"),
      );
    },
  });

  const onSubmit = (data: CreateJobApplicationRequest) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Section 1: Organization & Role Information */}
      <ApplicationFormSection
        title="Organization & Role Information"
        description="Specify target entity (Ministry, Bank, or Corporate), job title, and location."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {/* Company / Organization Dropdown */}
          <div className="space-y-1.5">
            <Label>{isGovtOrBank ? "Ministry / Govt Entity / Bank" : "Company / Organization"}</Label>
            <Select {...register("companyId")}>
              <option value="">Select organization...</option>
              {companies?.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </Select>
            {errors.companyId && (
              <p className="text-xs text-red-600">{errors.companyId.message}</p>
            )}
          </div>

          {/* Role Dropdown from Database */}
          <div className="space-y-1.5">
            <Label>{isGovtOrBank ? "Designation / Cadre / Post" : "Job Role / Title"}</Label>
            <Select {...register("role")}>
              <option value="">Select designation/role...</option>
              {initialData?.role && !jobRoles?.some((r) => r.name === initialData.role) && (
                <option value={initialData.role}>{initialData.role}</option>
              )}
              {jobRoles?.map((r) => (
                <option key={r.id} value={r.name}>
                  {r.name}
                </option>
              ))}
            </Select>
            {errors.role && (
              <p className="text-xs text-red-600">{errors.role.message}</p>
            )}
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <Label>Location / Posting</Label>
            <Input
              placeholder={isGovtOrBank ? "e.g. Agargaon, Dhaka / All Bangladesh" : "e.g. Dhaka, Bangladesh (or Remote)"}
              {...register("location")}
            />
          </div>

          {/* Salary Range / Pay Scale */}
          <div className="space-y-1.5">
            <Label>{isGovtOrBank ? "National Pay Scale / Grade" : "Salary Range"}</Label>
            <Input
              placeholder={isGovtOrBank ? "e.g. Grade-9 (22,000 - 53,060 BDT)" : "e.g. 60,000 - 90,000 BDT / $120k"}
              {...register("salaryRange")}
            />
          </div>
        </div>
      </ApplicationFormSection>

      {/* Section 2: Application Portal & Sourcing Channel */}
      <ApplicationFormSection
        title="Application Portal & Workflow"
        description="Configure sourcing platform (Teletalk, BPSC, LinkedIn, etc.), circular link, and current stage."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {/* Job Type (Govt vs Corporate) */}
          <div className="space-y-1.5">
            <Label>Job / Service Category</Label>
            <Select {...register("jobTypeId")}>
              <option value="">Select category...</option>
              {jobTypes?.map((jobType) => (
                <option key={jobType.id} value={jobType.id}>
                  {jobType.name}
                </option>
              ))}
            </Select>
            {errors.jobTypeId && (
              <p className="text-xs text-red-600">{errors.jobTypeId.message}</p>
            )}
          </div>

          {/* Sourcing Platform / E-Recruitment Portal */}
          <div className="space-y-1.5">
            <Label>Recruitment Platform / Portal</Label>
            <Select {...register("sourcePlatformId")}>
              <option value="">Select platform...</option>
              {platforms?.map((platform) => (
                <option key={platform.id} value={platform.id}>
                  {platform.name}
                </option>
              ))}
            </Select>
          </div>

          {/* Application Status (MCQ/Written/Viva/Interview) */}
          <div className="space-y-1.5">
            <Label>Recruitment Stage / Status</Label>
            <Select {...register("applicationStatusId")}>
              <option value="">Select current stage...</option>
              {statuses?.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.name}
                </option>
              ))}
            </Select>
            {errors.applicationStatusId && (
              <p className="text-xs text-red-600">{errors.applicationStatusId.message}</p>
            )}
          </div>

          {/* Priority */}
          <div className="space-y-1.5">
            <Label>Target Priority</Label>
            <Select {...register("priorityId")}>
              <option value="">Select priority...</option>
              {priorities?.map((priority) => (
                <option key={priority.id} value={priority.id}>
                  {priority.name}
                </option>
              ))}
            </Select>
            {errors.priorityId && (
              <p className="text-xs text-red-600">{errors.priorityId.message}</p>
            )}
          </div>

          {/* Work Arrangement */}
          <div className="space-y-1.5">
            <Label>Work Arrangement</Label>
            <Select {...register("workTypeId")}>
              <option value="">Select work arrangement...</option>
              {workTypes?.map((workType) => (
                <option key={workType.id} value={workType.id}>
                  {workType.name}
                </option>
              ))}
            </Select>
            {errors.workTypeId && (
              <p className="text-xs text-red-600">{errors.workTypeId.message}</p>
            )}
          </div>

          {/* Circular Link / Application URL */}
          <div className="space-y-1.5">
            <Label>
              {isGovtOrBank ? "Govt Circular / Application Portal URL" : "Job Posting / Application URL"}
            </Label>
            <Input
              placeholder={
                isGovtOrBank
                  ? "e.g. http://bpsc.teletalk.com.bd or https://alljobs.teletalk.com.bd"
                  : "https://..."
              }
              {...register("jobUrl")}
            />
          </div>
        </div>
      </ApplicationFormSection>

      {/* Section 3: Notes & Exam Documents */}
      <ApplicationFormSection
        title="Syllabus, Exam Notes & Documents"
        description="Track written syllabus, past exam question links, and resume/application form."
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Exam Insights & Preparation Notes (Markdown Supported)</Label>
            <Textarea
              rows={5}
              placeholder={
                isGovtOrBank
                  ? "## Written Exam Details\n- Date & Time: Friday, 10:00 AM at BUET\n- Topics: C++, Data Structures, Computer Networks, SQL\n- Marks: 200 (Pass mark: 50%)"
                  : "Interview rounds, system design notes, follow-up timeline..."
              }
              {...register("notes")}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Resume / Applicant Copy Drive Link</Label>
            <Input
              placeholder="https://drive.google.com/..."
              {...register("resumeDriveLink")}
            />
          </div>
        </div>
      </ApplicationFormSection>

      <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending
            ? initialData
              ? "Updating..."
              : "Saving..."
            : initialData
              ? "Update Application"
              : "Save Application"}
        </Button>
      </div>
    </form>
  );
}
